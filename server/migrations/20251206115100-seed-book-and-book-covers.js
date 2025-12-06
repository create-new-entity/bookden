'use strict';

const booksSeedData = require('../seed/seedData/books_seed_data.json');
const path = require('path');
const fs = require('fs');

var dbm;
var type;
var seed;

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
  
      // Add 1 second for each book to avoid having the same created_at for the same book
      const createdAt = new Date(baseTime.getTime() + i * 1000);
  
      const result = await db.runSql(
        `INSERT INTO books (
          title,
          synopsis,
          authors,
          isbn,
          price,
          date_published,
          language,
          pages,
          created_at
        )
        VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9)
        RETURNING book_id, isbn;`,
        [title, synopsis, JSON.stringify(authors ?? []), isbn, Number(price ?? 20.00), date_published, language, pages, createdAt]
      );
  
      const bookId = result.rows[0].book_id;
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
