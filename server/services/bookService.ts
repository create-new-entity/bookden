import * as R from 'ramda';
import camelcaseKeys from 'camelcase-keys';

import { getPGDBPool, getRedis, sqlTag } from '../configs';
import { Book, BooksSortByOptions, BooksSortOrderOptions, CreateBookPayload, PaginatedDataList, PriceRange, UpdateBookPayload } from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep } from '../utilities';
import { BOOKS_PAGINATION_LIMIT, PRICE_RANGE_CACHE_KEY, PRICE_RANGE_TTL_SECONDS } from '../constants';
import { BadRequestError, errorMessages, errorNames } from '../errors';
import { sql } from 'slonik';

// import { BOOKS_PAGINATION_LIMIT } from '../constants';



const getAllBooks = async (includeDeleted: boolean = false, page: number = 1, search: string = '', sortBy: BooksSortByOptions = 'title', sortOrder: BooksSortOrderOptions = 'desc', tags: string[] = []): Promise<PaginatedDataList<Book>> => {
    const dbPool = await getPGDBPool();

    const searchFragment = search && search.trim() !== ''
        ? sqlTag.fragment`
            AND (
                title ILIKE ${'%' + search + '%'}
                OR EXISTS (
                    SELECT 1
                    FROM jsonb_array_elements_text(authors) AS author
                    WHERE author ILIKE ${'%' + search + '%'}
                )
            )
        `
        : sqlTag.fragment``;


    /*
        Include deleted books if includeDeleted is true.
        Otherwise, include only non-deleted books. Books that have not
        been deleted will have null in deleted_at column. Because we are soft deleting.
    */
    const deletedAtFragment = includeDeleted ? sqlTag.fragment`` : sqlTag.fragment`AND deleted_at IS NULL`;


    const snakeCasedSortBy = convertStringToSnakeCase(sortBy);
    const sortOrderFragment = sortOrder === 'asc' ? sqlTag.fragment`ASC` : sqlTag.fragment`DESC`;
    const sortByFragment = sqlTag.fragment`ORDER BY ${sqlTag.identifier([snakeCasedSortBy])} ${sortOrderFragment}`;
    const tagsFragment = tags.length > 0 ? sqlTag.fragment`
        AND EXISTS (
            SELECT 1
            FROM book_tags bt
            INNER JOIN tags t
                ON bt.tag_id = t.tag_id
            WHERE bt.book_id = books.book_id
            AND (
                ${sqlTag.join(tags.map(tag => sqlTag.fragment`t.tag ILIKE ${tag}`), sqlTag.fragment` OR `)}
            )
        )`
        :
        sqlTag.fragment``;

    const result = await dbPool.query(sqlTag.typeAlias('Book')`
        SELECT
            books.book_id, title, synopsis,
            COALESCE(array_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL), '{}') AS tags,
            authors, isbn, price,
            year_published, language, pages,
            created_at, updated_at, deleted_at
        FROM books
        LEFT JOIN book_tags bt
            ON bt.book_id = books.book_id   -- left join makes more sense. inner join will drop books if there are no tags.
        LEFT JOIN tags t
            ON t.tag_id = bt.tag_id
        WHERE 1 = 1
        ${tagsFragment}
        ${searchFragment}
        ${deletedAtFragment}
        GROUP BY books.book_id
        ${sortByFragment}
        LIMIT ${BOOKS_PAGINATION_LIMIT} OFFSET ${(page - 1) * BOOKS_PAGINATION_LIMIT};
    `);

    const totalResult = await dbPool.one(sqlTag.typeAlias('Total')`
        SELECT COUNT(book_id)::int AS total
        FROM books
        WHERE 1 = 1
        ${tagsFragment}
        ${searchFragment}
        ${deletedAtFragment}
    `);
    const totalBooks = totalResult.total;

    const totalPages = Math.ceil(totalBooks / BOOKS_PAGINATION_LIMIT);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    const books = [...camelcaseKeys(result.rows, { deep: true })];

    return {
        data: books,
        pagination: {
            page,
            limit: BOOKS_PAGINATION_LIMIT,
            total: totalBooks,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    };
};

const getBook = async (bookId: number, includeDeleted: boolean = false) => {
    const dbPool = await getPGDBPool();
    const deletedAtFragment = includeDeleted ? sqlTag.fragment`` : sqlTag.fragment`AND deleted_at IS NULL`;
    const result = await dbPool.query(sqlTag.typeAlias('Book')`
        SELECT
            books.book_id, title, synopsis,
            COALESCE(array_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL), '{}') AS tags,
            authors, isbn, price,
            year_published, language, pages,
            created_at, updated_at, deleted_at
        FROM books
        LEFT JOIN book_tags bt
            ON bt.book_id = books.book_id
        LEFT JOIN tags t
            ON t.tag_id = bt.tag_id
        WHERE books.book_id = ${bookId}
        ${deletedAtFragment}
        GROUP BY books.book_id;
    `);
    return camelcaseKeys(result.rows[0], { deep: true });
};

const createBook = async (createBookData: CreateBookPayload, coverImage: Buffer, coverImageMimeType: string): Promise<Book> => {
    const dbPool = await getPGDBPool();

    return await dbPool.transaction(async (trx) => {
        const snakeCasedData = convertToSnakeCaseDeep(createBookData);
        const tags = createBookData.tags;

        // If there are invalid tags, throw an error.
        if (tags && tags.length > 0) {
            const tagRows = await trx.query(sqlTag.typeAlias('Tag')`
                SELECT tag_id
                FROM tags
                WHERE tag = ANY(${sql.array(tags, 'text')});
            `);
    
            if (tagRows.rows.length !== tags.length) {
                throw new BadRequestError(errorMessages[errorNames.invalidBookTags]);
            }
        }
    
    
        const result = await trx.query(sqlTag.typeAlias('Book')`
            WITH
                inserted_book AS (
                    INSERT INTO books (
                        title, synopsis, authors, isbn,
                        price, year_published, language, pages
                    )
                    VALUES (
                        ${snakeCasedData.title}, ${snakeCasedData.synopsis || ''}, ${JSON.stringify(snakeCasedData.authors || [])}::jsonb, ${snakeCasedData.isbn},
                        ${snakeCasedData.price}, ${snakeCasedData.year_published}, ${snakeCasedData.language}, ${snakeCasedData.pages || 100}
                    )
                    RETURNING
                        book_id, title, synopsis, authors,
                        isbn, price, year_published, language,
                        pages, created_at, updated_at, deleted_at
                ),
                insert_cover AS (
                    INSERT INTO book_covers (
                        book_id,
                        image_data,
                        mime_type
                    )
                    SELECT
                        book_id,
                        ${sqlTag.binary(coverImage)},
                        ${coverImageMimeType}
                    FROM inserted_book
                    RETURNING book_id
                )
    
            SELECT *
            FROM inserted_book;
        `);

        if (tags.length > 0) {
            await trx.query(sqlTag.typeAlias('Void')`
              INSERT INTO book_tags (book_id, tag_id)
              SELECT
                ${result.rows[0].book_id},
                tag_id
              FROM tags
              WHERE tag = ANY(${sql.array(tags, 'text')});
            `);
        }

        const fullBook = await trx.query(sqlTag.typeAlias('Book')`
            SELECT
                b.book_id, b.title, b.synopsis,
                b.authors, b.isbn, b.price, b.year_published,
                b.language, b.pages,
                COALESCE(
                    array_agg(t.tag) FILTER (WHERE t.tag IS NOT NULL),
                    '{}'
                ) AS tags,
                b.created_at, b.updated_at, b.deleted_at
            FROM books b
            LEFT JOIN book_tags bt
                ON bt.book_id = b.book_id
            LEFT JOIN tags t
                ON t.tag_id = bt.tag_id
            WHERE b.book_id = ${result.rows[0].book_id}
            GROUP BY b.book_id;
        `);
        return camelcaseKeys(fullBook.rows[0], { deep: true });
    });
};

const updateBook = async (bookId: number, updateBookData: UpdateBookPayload) => {
    const dbPool = await getPGDBPool();

    await dbPool.transaction(async (trx) => {
        const fragments = [];

        if(updateBookData.title) {
            fragments.push(sqlTag.fragment`title = ${updateBookData.title}`);
        }
        if(updateBookData.synopsis !== undefined) {
            fragments.push(sqlTag.fragment`synopsis = ${updateBookData.synopsis}`);
        }

        const nonEmptyAuthors = updateBookData.authors?.filter(a => !R.isEmpty(a));
        if(nonEmptyAuthors && nonEmptyAuthors.length) {
            fragments.push(sqlTag.fragment`authors = ${nonEmptyAuthors}::jsonb`);
        }
        
        if(updateBookData.isbn) {
            fragments.push(sqlTag.fragment`isbn = ${updateBookData.isbn}`);
        }
        if(updateBookData.price !== undefined) {
            fragments.push(sqlTag.fragment`price = ${updateBookData.price}`);
        }

        if(updateBookData.yearPublished) {
            fragments.push(sqlTag.fragment`year_published = ${updateBookData.yearPublished}`);
        }
        if(updateBookData.language) {
            fragments.push(sqlTag.fragment`language = ${updateBookData.language}`);
        }
        if(updateBookData.pages) {
            fragments.push(sqlTag.fragment`pages = ${updateBookData.pages}`);
        }

        if (fragments.length > 0) {
            await trx.query(sqlTag.typeAlias('Book')`
                UPDATE books
                SET ${sqlTag.join(fragments, sqlTag.fragment`, `)}
                WHERE book_id = ${bookId};
            `);
        }

        if (updateBookData.tags?.length) {
            const tagRows = await trx.query(sqlTag.typeAlias('Tag')`
                SELECT tag_id
                FROM tags
                WHERE tag = ANY(${sql.array(updateBookData.tags, 'text')});
            `);
      
            if (tagRows.rows.length !== updateBookData.tags.length) {
                throw new BadRequestError(errorMessages[errorNames.invalidBookTags]);
            }
      
            await trx.query(sqlTag.typeAlias('Void')`
                DELETE FROM book_tags
                WHERE book_id = ${bookId};
            `);
      
            await trx.query(sqlTag.typeAlias('Void')`
                INSERT INTO book_tags (book_id, tag_id)
                SELECT ${bookId}, tag_id
                FROM tags
                WHERE tag = ANY(${sql.array(updateBookData.tags, 'text')});
            `);
        }
    });
};

const updateBookCover = async (bookId: number, coverImage: Buffer, coverImageMimeType: string) => {
    const dbPool = await getPGDBPool();
    await dbPool.query(sqlTag.typeAlias('BookCover')`
        UPDATE book_covers
        SET image_data = ${sqlTag.binary(coverImage)}, mime_type = ${coverImageMimeType}
        WHERE book_id = ${bookId};
    `);
};

const deleteBook = async (bookId: number) => {
    const dbPool = await getPGDBPool();
    await dbPool.query(sqlTag.typeAlias('Book')`
        UPDATE books
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE book_id = ${bookId};
    `);
};

const deleteBookCover = async (bookId: number) => {
    const dbPool = await getPGDBPool();
    await dbPool.query(sqlTag.typeAlias('BookCover')`
        DELETE FROM book_covers
        WHERE book_id = ${bookId};
    `);
};

const getBookCover = async (bookId: number, includeDeleted: boolean = false) => {
    const innerJoinToFindUnDeleted = sqlTag.fragment`
        INNER JOIN books b
            ON bc.book_id = b.book_id
            AND b.deleted_at IS NULL
    `;

    const dbPool = await getPGDBPool();
    const joinFragment = includeDeleted ? sqlTag.fragment`` : innerJoinToFindUnDeleted;
    
    const result = await dbPool.query(sqlTag.typeAlias('BookCover')`
        SELECT book_cover_id, bc.book_id, image_data, mime_type, bc.created_at, bc.updated_at
        FROM book_covers bc
        ${joinFragment}
        WHERE bc.book_id = ${bookId};
    `);
    return camelcaseKeys(result.rows[0], { deep: true });
};

const getTags = async () => {
    const dbPool = await getPGDBPool();
    const result = await dbPool.query(sqlTag.typeAlias('Tag')`
        SELECT tag_id, tag
        FROM tags;
    `);
    return camelcaseKeys(result.rows, { deep: true });
};
    
const getBooksPriceRange = async (): Promise<PriceRange> => {
    const redis = getRedis();
    const cached = await redis.get(PRICE_RANGE_CACHE_KEY);
  
    if (cached) {
        return JSON.parse(cached);
    }
  
    const dbPool = await getPGDBPool();
    const result = await dbPool.one(sqlTag.typeAlias('PriceRange')`
        SELECT
            MIN(price) AS min_price,
            MAX(price) AS max_price
        FROM books
        WHERE deleted_at IS NULL
    `);
  

    // Defensive default. This shouldn't be necessary. Since tables are seeded with data.
    const priceRange: PriceRange = {
        min: result.min_price ?? 0,
        max: result.max_price ?? 1000,
    };
  
    await redis.set(
        PRICE_RANGE_CACHE_KEY,
        JSON.stringify(priceRange),
        { EX: PRICE_RANGE_TTL_SECONDS }
    );
  
    return priceRange;
};
  

export {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBookCover,
    updateBookCover,
    deleteBookCover,
    getTags,
    getBooksPriceRange
};