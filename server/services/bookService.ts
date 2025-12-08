import * as R from 'ramda';
import camelcaseKeys from 'camelcase-keys';

import { getPGDBPool, sqlTag } from '../configs';
import { Book, BooksSortByOptions, BooksSortOrderOptions, CreateBookPayload, UpdateBookPayload } from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep } from '../utilities';
import { BOOKS_PAGINATION_LIMIT } from '../constants';
// import { BOOKS_PAGINATION_LIMIT } from '../constants';



const getAllBooks = async (includeDeleted: boolean = false, page: number = 1, search: string = '', sortBy: BooksSortByOptions = 'createdAt', sortOrder: BooksSortOrderOptions = 'desc') => {
    const dbPool = await getPGDBPool();

    const searchFragment = search && search.trim() !== ''
        ? sqlTag.fragment`AND title ILIKE ${'%' + search.trim() + '%'}`
        : sqlTag.fragment``;


    /*
        Include deleted books if includeDeleted is true.
        Otherwise, include only non-deleted books. Books that have not
        been deleted will have null in deleted_at column. Because we are soft deleting.
    */
    const deletedAtFragment = includeDeleted ? sqlTag.fragment`` : sqlTag.fragment`AND deleted_at IS NULL`;


    const snakeCasedSortBy = convertStringToSnakeCase(sortBy);
    const sortOrderFragment = sortOrder === 'asc' ? sqlTag.fragment`ASC` : sqlTag.fragment`DESC`;
    const sortByFragment = snakeCasedSortBy ? sqlTag.fragment`ORDER BY ${snakeCasedSortBy} ${sortOrderFragment}` : sqlTag.fragment``;


    const result = await dbPool.query(sqlTag.typeAlias('Book')`
        SELECT
            book_id, title, synopsis,
            authors, isbn, price,
            year_published, language, pages,
            created_at, updated_at, deleted_at
        FROM books
        WHERE 1 = 1
        ${searchFragment}
        ${deletedAtFragment}
        ${sortByFragment}
        LIMIT ${BOOKS_PAGINATION_LIMIT} OFFSET ${(page - 1) * BOOKS_PAGINATION_LIMIT};
    `);

    return camelcaseKeys(result.rows, { deep: true });
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

const createBook = async (createBookData: CreateBookPayload): Promise<Book> => {
    const dbPool = await getPGDBPool();
    const snakeCasedData = convertToSnakeCaseDeep(createBookData);
    const result = await dbPool.query(sqlTag.typeAlias('Book')`
        INSERT INTO books (
            title,
            synopsis,
            authors,
            isbn,
            price,
            year_published,
            language,
            pages
        )
        VALUES (
            ${snakeCasedData.title},
            ${snakeCasedData.synopsis},
            ${JSON.stringify(snakeCasedData.authors)}::jsonb,
            ${snakeCasedData.isbn},
            ${snakeCasedData.price},
            ${snakeCasedData.year_published},
            ${snakeCasedData.language},
            ${snakeCasedData.pages}
        )
        RETURNING
            book_id,
            title,
            synopsis,
            authors,
            isbn,
            price,
            year_published,
            language,
            pages,
            created_at,
            updated_at,
            deleted_at;
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

const deleteBook = async (bookId: number) => {
    const dbPool = await getPGDBPool();
    await dbPool.query(sqlTag.typeAlias('Book')`
        UPDATE books
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE book_id = ${bookId};
    `);
};

export {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
};