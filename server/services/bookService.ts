import * as R from 'ramda';
import camelcaseKeys from 'camelcase-keys';

import { getPGDBPool, sqlTag } from '../configs';
import { Book, BooksSortByOptions, BooksSortOrderOptions, CreateBookPayload, PaginatedDataList, UpdateBookPayload } from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep } from '../utilities';
import { BOOKS_PAGINATION_LIMIT } from '../constants';
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
            book_id, title, synopsis,
            authors, isbn, price,
            year_published, language, pages,
            created_at, updated_at, deleted_at
        FROM books
        WHERE book_id = ${bookId}
        ${deletedAtFragment};
    `);
    return camelcaseKeys(result.rows[0], { deep: true });
};

const createBook = async (createBookData: CreateBookPayload, coverImage: Buffer, coverImageMimeType: string): Promise<Book> => {
    const dbPool = await getPGDBPool();
    const snakeCasedData = convertToSnakeCaseDeep(createBookData);
    const result = await dbPool.query(sqlTag.typeAlias('Book')`
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
    return camelcaseKeys(result.rows[0], { deep: true });
};

const updateBook = async (bookId: number, updateBookData: UpdateBookPayload) => {
    const dbPool = await getPGDBPool();

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

    if (fragments.length === 0) {
        return;
    }

    await dbPool.query(sqlTag.typeAlias('Book')`
        UPDATE books
        SET ${sqlTag.join(fragments, sqlTag.fragment`, `)}
        WHERE book_id = ${bookId};
    `);
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

export {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBookCover,
    updateBookCover,
    deleteBookCover
};