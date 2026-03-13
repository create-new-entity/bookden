import * as R from 'ramda';
import camelcaseKeys from 'camelcase-keys';
import { sql } from 'slonik';

import { getPGDBPool, getRedis, sqlTag } from '../configs';
import {
    Book, BookDBRow, BooksQueryContext, BooksQueryOptions,
    CreateBookPayload, HomepageBookListsResponse, PaginatedDataList, PriceRange, UpdateBookPayload
} from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep, mapNumericTimeStampsToDate } from '../utilities';
import {
    DEFAULT_BOOK_FILTER_OPTIONS, HOMEPAGE_BOOK_LISTS,
    HOMEPAGE_BOOK_LISTS_CAROUSEL_LIMIT,
    PRICE_RANGE_CACHE_KEY, PRICE_RANGE_TTL_SECONDS
} from '../constants';
import {
    BadRequestError, errorMessages, errorNames,
    UnauthorizedError, NotFoundError
} from '../errors';


const mapDate = (book: BookDBRow): Book => {
    const timeStamps = {
        createdAt: book.created_at,
        updatedAt: book.updated_at,
        deletedAt: book.deleted_at
    };
    const dateStamps = mapNumericTimeStampsToDate(timeStamps);

    return {
        bookId: book.book_id,
        title: book.title,
        synopsis: book.synopsis,
        authors: book.authors,
        isbn: book.isbn,
        price: book.price,
        yearPublished: book.year_published,
        language: book.language,
        pages: book.pages,
        ...(book.is_wishlisted !== undefined ? { isWishlisted: book.is_wishlisted } : {}),
        ...dateStamps
    };
};


/*
    Note to future self:

    Why the 'context'? Why this refactor? -> https://chatgpt.com/share/699317ca-c388-8012-8ef9-039971adf36d

    In short, decouple the logic that gets a bunch of books from db.
    "A bunch of books" can be fetched for different purposes / contexts.

    For example:
        1. A bunch of books that are in user's wishlist.
        2. Just a bunch of books without any addtional context.
        3. Not implemented yet, but some additional contexts can be: recommended books, most popular books and so on.

    In other words, pass the context from outside and let the function get the relevant books.
*/

const getBooksInternal = async (
    context: BooksQueryContext,
    options: BooksQueryOptions
): Promise<PaginatedDataList<Book>> => {
    const {
        includeDeleted, search, sortBy,
        sortOrder, tags, priceRanges, page
    } = options;
    const { requestingUserId } = context;
    
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

    const priceMinFragment =
        priceRanges?.priceMin !== undefined
            ? sqlTag.fragment`AND price >= ${priceRanges.priceMin}`
            : sqlTag.fragment``;
    
    const priceMaxFragment =
        priceRanges?.priceMax !== undefined
            ? sqlTag.fragment`AND price <= ${priceRanges.priceMax}`
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
    const randomOrderFragment = options.randomOrder ? sqlTag.fragment`ORDER BY RANDOM()` : sqlTag.fragment``;
    const randomOrderOrSortByFragment = options.randomOrder ? randomOrderFragment : sortByFragment;

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

    const baseWhereFragment = context.baseWhereFragment ?? sqlTag.fragment``;


    const wishlistSelectFragment = requestingUserId
        ? sqlTag.fragment`
            ,
            (uw.user_id IS NOT NULL) AS is_wishlisted    -- If user_id is not null, then the book is wishlisted by the user.
        `
        : sqlTag.fragment``;
    const wishlistJoinFragment = requestingUserId
        ? sqlTag.fragment`
            LEFT JOIN user_book_wishlist uw
                ON uw.book_id = books.book_id
                AND uw.user_id = ${requestingUserId}
        `
        : sqlTag.fragment``;
    const wishlistGroupByFragment = requestingUserId
        ? sqlTag.fragment`, uw.user_id`
        : sqlTag.fragment``;


    const result = await dbPool.query(sqlTag.typeAlias('Book')`
        SELECT
            books.book_id, title, synopsis,
            COALESCE(array_agg(DISTINCT t.tag) FILTER (WHERE t.tag IS NOT NULL), '{}') AS tags,
            authors, isbn, price,
            year_published, language, pages,
            books.created_at, books.updated_at, books.deleted_at
            ${wishlistSelectFragment}
        FROM books
        ${wishlistJoinFragment}
        LEFT JOIN book_tags bt
            ON bt.book_id = books.book_id   -- left join makes more sense. inner join will drop books if there are no tags.
        LEFT JOIN tags t
            ON t.tag_id = bt.tag_id
        WHERE 1 = 1
        ${baseWhereFragment}
        ${tagsFragment}
        ${searchFragment}
        ${deletedAtFragment}
        ${priceMinFragment}
        ${priceMaxFragment}
        GROUP BY books.book_id ${wishlistGroupByFragment}
        ${randomOrderOrSortByFragment}
        LIMIT ${options.limit}
        OFFSET ${(page - 1) * options.limit};
    `);

    const books = result.rows;

    if(!options.includePagination) {
        return {
            data: books.map(mapDate)
        };
    }

    const totalResult = await dbPool.one(sqlTag.typeAlias('Total')`
        SELECT COUNT(book_id)::int AS total
        FROM books
        WHERE 1 = 1
        ${baseWhereFragment}
        ${tagsFragment}
        ${searchFragment}
        ${deletedAtFragment}
        ${priceMinFragment}
        ${priceMaxFragment}
    `);
    const totalBooks = totalResult.total;

    const totalPages = Math.ceil(totalBooks / options.limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    return {
        data: books.map(mapDate),
        pagination: {
            page,
            limit: options.limit,
            total: totalBooks,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    };
};

const checkIfUserIsDeleted = async (userId: number) => {
    const dbPool = await getPGDBPool();

    /* 
        Note to future self:
        We use soft deletion of users. So we need to check if the user is deleted.
        If yes, throw an error.
    */
    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT 1
        FROM users
        WHERE user_id = ${userId}
        AND deleted_at IS NULL
    `);

    if (result.rows.length === 0) {
        throw new UnauthorizedError('User not found');
    }
};

const getAllBooks = async (options: Partial<BooksQueryOptions>, userId?: number): Promise<PaginatedDataList<Book>> => {
    const resolvedOptions = R.mergeAll([DEFAULT_BOOK_FILTER_OPTIONS, options]);
    
    if(userId !== undefined) {
        await checkIfUserIsDeleted(userId);
    }
    return getBooksInternal(
        {
            baseWhereFragment: sqlTag.fragment``,
            ...(
                userId !== undefined
                    ?
                    { requestingUserId: userId }
                    :
                    {}
            )
        },
        resolvedOptions
    );
};

const getWishlistedBooks = async (
    options: Partial<BooksQueryOptions>,
    userId: number
): Promise<PaginatedDataList<Book>> => {
    
    await checkIfUserIsDeleted(userId);
    
    /*
        Merge the default options with the provided options.
    */
    const resolvedOptions = R.mergeAll([DEFAULT_BOOK_FILTER_OPTIONS, { ...options, includeDeleted: false }]);

    return getBooksInternal(
        {
            baseWhereFragment: sqlTag.fragment`
                AND EXISTS (
                    SELECT 1
                    FROM user_book_wishlist ubw
                    WHERE ubw.book_id = books.book_id
                    AND ubw.user_id = ${userId}
                )
            `,
            requestingUserId: userId
        },
        resolvedOptions
    );
};


/*
    Note to future self:

    getBooksInternal is basically a generic query that returns a bunch of
    books based on how the query is constructed using the context and options.

    getHomepageBookLists below calls getBooksInternal with different contexts and options to get
    different lists of books for the homepage carousels.

    For example, one carousel is for drama books,
    another is for romance books and so on.
    
    Each carousel has different query options based on the genre or filter it represents.

    Also this: https://chatgpt.com/share/69b468e4-f04c-8012-a98a-b564b2c13fb2

*/

const getHomepageBookLists = async (): Promise<HomepageBookListsResponse> => {
    const homePageBookListsPromises = HOMEPAGE_BOOK_LISTS.map(
        async (config) => {
            const options: BooksQueryOptions = {
                ...DEFAULT_BOOK_FILTER_OPTIONS,
                ...config.queryOptions,
                page: 1,
                limit: HOMEPAGE_BOOK_LISTS_CAROUSEL_LIMIT,
                includePagination: false,
                randomOrder: true
            };

            const result = await getBooksInternal(
                {
                    baseWhereFragment: config.extraWhereFragment
                        ? config.extraWhereFragment(sqlTag)
                        : sqlTag.fragment``
                },
                options
            );

            return {
                key: config.key,
                title: config.title,
                books: result.data
            };
        }
    );
    const lists = await Promise.all(homePageBookListsPromises);
    return { bookLists: lists };
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
        return mapDate(fullBook.rows[0]);
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
            fragments.push(
                sqlTag.fragment`authors = ${sql.json(nonEmptyAuthors)}`
            );
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
        INSERT INTO book_covers (book_id, image_data, mime_type)
        VALUES (${bookId}, ${sqlTag.binary(coverImage)}, ${coverImageMimeType})
        ON CONFLICT (book_id)
        DO UPDATE
        SET
            image_data = EXCLUDED.image_data,
            mime_type = EXCLUDED.mime_type;
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
            MIN(price) AS price_min,
            MAX(price) AS price_max
        FROM books
        WHERE deleted_at IS NULL
    `);
  

    // Defensive default. This shouldn't be necessary. Since tables are seeded with data.
    const priceRange: PriceRange = {
        priceMin: result.price_min ?? 0,
        priceMax: result.price_max ?? 1000,
    };
  
    await redis.set(
        PRICE_RANGE_CACHE_KEY,
        JSON.stringify(priceRange),
        { EX: PRICE_RANGE_TTL_SECONDS } // Should be same as staleTime in useBooksFiltersMeta hook.
    );
  
    return priceRange;
};

const restoreBook = async (bookId: number) => {
    const dbPool = await getPGDBPool();
    await dbPool.query(sqlTag.typeAlias('Book')`
        UPDATE books
        SET deleted_at = NULL
        WHERE book_id = ${bookId};
    `);
};

const addBookToWishlist = async (userId: number, bookId: number) => {
    const dbPool = await getPGDBPool();

    await dbPool.transaction(async (trx) => {
        /* 
            Note to future self:
            We use soft deletion of users. So we need to check if the user is deleted.
            If yes, throw an error.
        */
        const userResult = await trx.query(sqlTag.typeAlias('User')`
            SELECT 1
            FROM users
            WHERE user_id = ${userId}
            AND deleted_at IS NULL
        `);

        if (userResult.rows.length === 0) {
            throw new UnauthorizedError('User not found');
        }

        /*
            Note to future self:
            We use soft deletion of books. So we need to check if the book is deleted.
            If yes, throw an error.
        */

        const bookResult = await trx.query(sqlTag.typeAlias('Book')`
            SELECT 1
            FROM books
            WHERE book_id = ${bookId}
            AND deleted_at IS NULL
        `);

        if (bookResult.rows.length === 0) {
            throw new NotFoundError('Book not found');
        }

        // At this point, it is guaranteed that, both the user and the book are not deleted.
        await trx.query(sqlTag.typeAlias('UserBookWishlist')`
            INSERT INTO user_book_wishlist (user_id, book_id)
            VALUES (${userId}, ${bookId})
            ON CONFLICT (user_id, book_id) DO NOTHING;
        `);
    });
};


const removeBookFromWishlist = async (userId: number, bookId: number) => {
    const dbPool = await getPGDBPool();
    
    await dbPool.transaction(async (trx) => {
        /* 
            Note to future self:
            We use soft deletion of users. So we need to check if the user is deleted.
            If yes, throw an error.
        */
        const userResult = await trx.query(sqlTag.typeAlias('User')`
            SELECT 1
            FROM users
            WHERE user_id = ${userId}
            AND deleted_at IS NULL
        `);

        if (userResult.rows.length === 0) {
            throw new UnauthorizedError('User not found');
        }

        /*
            Note to future self:
            We use soft deletion of books. So we need to check if the book is deleted.
            If yes, throw an error.
         */
        const bookResult = await trx.query(sqlTag.typeAlias('Book')`
            SELECT 1
            FROM books
            WHERE book_id = ${bookId}
            AND deleted_at IS NULL
        `);

        if (bookResult.rows.length === 0) {
            throw new NotFoundError('Book not found');
        }

        // At this point, it is guaranteed that, both the user and the book are not deleted.
        await trx.query(sqlTag.typeAlias('UserBookWishlist')`
            DELETE FROM user_book_wishlist
            WHERE user_id = ${userId} AND book_id = ${bookId};
        `);
    });
};
  

export {
    getAllBooks,
    getWishlistedBooks,
    getHomepageBookLists,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    getBookCover,
    updateBookCover,
    deleteBookCover,
    getTags,
    getBooksPriceRange,
    restoreBook,
    addBookToWishlist,
    removeBookFromWishlist
};