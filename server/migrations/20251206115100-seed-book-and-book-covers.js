'use strict';

const booksSeedData = require('../seed/seedData/books_seed_data.json');
const path = require('path');
const fs = require('fs');

var dbm;
var type;
var seed;

function extractYear(raw) {
  const DEFAULT_YEAR = 2000;

  if (!raw || typeof raw !== "string") return DEFAULT_YEAR;

  const match = raw.match(/\b(19|20)\d{2}\b/);
  if (match) return Number(match[0]);

  return DEFAULT_YEAR;
}

function extractUniqueTags() {
  const uniqueTags = new Set();

  for (const book of booksSeedData) {
    if (Array.isArray(book.subjects)) {
      for (const subject of book.subjects) {
        if (typeof subject === 'string' && subject.trim() !== '') {
          uniqueTags.add(sanitizeTag(subject));
        }
      }
    }
  }

  return Array.from(uniqueTags);
}

function stripHtmlTags(input) {
  if (!input || typeof input !== 'string') return input;

  return input
    .replace(/<[^>]*>/g, ' ')   // remove all tags like <br>, <br/>, </p>, etc.
    .replace(/\s+/g, ' ')       // collapse multiple spaces
    .trim();
}

function sanitizeTag(tag) {
  if (!tag || typeof tag !== 'string') return null;

  return tag
    .replace(/,/g, '')        // remove commas
    .replace(/\s+/g, ' ')     // normalize spaces
    .trim()
    .toLowerCase();
}


/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const coverImagesFolder = path.join(__dirname, '../seed/seedData/coverImages');
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  const baseTime = new Date();
  const uniqueTags = extractUniqueTags();
  const bookTagsBuffer = [];

  try {
    await db.runSql('BEGIN');
    for (let i = 0; i < booksSeedData.length; i++) {
      const book = booksSeedData[i];
      const {
        title,
        synopsis,
        authors,
        isbn13: isbn,
        msrp: price,
        date_published,
        language,
        pages
      } = book;
  
      if (!isbn) {
        continue
      };

      const cleanTitle = stripHtmlTags(title);
      const cleanSynopsis = stripHtmlTags(synopsis);
  
      // Add 1 second for each book to avoid having the same created_at for the same book
      const createdAt = new Date(baseTime.getTime() + i * 1000);

      const datePublishedYear = extractYear(date_published);
  
      const result = await db.runSql(
        `INSERT INTO books (
          title,
          synopsis,
          authors,
          isbn,
          price,
          year_published,
          language,
          pages,
          created_at
        )
        VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9)
        RETURNING book_id, isbn;`,
        [cleanTitle, cleanSynopsis, JSON.stringify(authors ?? []), isbn, Number(price ?? 20.00), datePublishedYear, language ?? 'en', pages ?? 100, createdAt]
      );
  
      const bookId = result.rows[0].book_id;

      bookTagsBuffer.push({
        bookId,
        tags: book.subjects?.map(sanitizeTag) ?? []
      });


      const bookIsbn = result.rows[0].isbn;
      let selectedPath = null;
      let mimeType = null;
  
      for (const ext of imageExtensions) {
        const candidate = path.join(coverImagesFolder, `${bookIsbn}.${ext}`);
  
        if (fs.existsSync(candidate)) {
          selectedPath = candidate;
  
          if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
          if (ext === 'png') mimeType = 'image/png';
          if (ext === 'webp') mimeType = 'image/webp';
  
          break;
        }
      }
  
      if (!selectedPath) continue;
  
      const buffer = fs.readFileSync(selectedPath);
  
      await db.runSql(
        `INSERT INTO book_covers (book_id, image_data, mime_type) VALUES ($1, $2, $3)`,
        [bookId, buffer, mimeType]
      );
    }

    await db.runSql(`
      CREATE TABLE tags (
        tag_id SERIAL PRIMARY KEY,
        tag TEXT NOT NULL UNIQUE
      );
    `);
    
    await db.runSql(`
      CREATE TABLE book_tags (
          book_id INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
          tag_id  INT NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
          PRIMARY KEY (book_id, tag_id)
      );
    `);

    const tagIdByName = new Map();

    for (const tag of uniqueTags) {
      const result = await db.runSql(
        `
          INSERT INTO tags (tag)
          VALUES ($1)
          ON CONFLICT (tag) DO NOTHING
          RETURNING tag_id;
        `,
        [tag]
      );

      if (result.rows.length > 0) {
        tagIdByName.set(tag, result.rows[0].tag_id);
      }
    }

    for (const entry of bookTagsBuffer) {
      const { bookId, tags } = entry;
    
      for (const tag of tags) {
        const tagId = tagIdByName.get(tag.trim());
        if (!tagId) continue;
    
        await db.runSql(
          `
            INSERT INTO book_tags (book_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `,
          [bookId, tagId]
        );
      }
    }
    

    
    await db.runSql('COMMIT');
  }
  catch(error) {
    await db.runSql('ROLLBACK');
    throw error;
  }

  return null;
};

exports.down = async function(db) {
  await db.runSql(`DELETE FROM book_covers`);
  await db.runSql(`DELETE FROM books`);
  return null;
};

exports._meta = {
  "version": 1
};
