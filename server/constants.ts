import { BooksQueryOptions, HomepageBookListConfig } from './types';

export const TOKEN_VALIDITY_SECONDS = 60 * 60; // 1 hour in seconds


export const SALT_ROUNDS = 10;


export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
export const imageMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'] as const;


export const sortOrderOptions = ['asc', 'desc'] as const;


export const userTypes = ['customer', 'admin', 'superadmin'] as const;
export const usersSortByOptions = ['username', 'email', 'userType', 'createdAt', 'updatedAt', 'deletedAt'] as const;
export const USERS_PAGINATION_LIMIT = 24;


export const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;
export const LOGIN_RATE_LIMIT_MAX = 30;
export const GLOBAL_RATE_LIMIT_MAX = 1000;


export const BOOKS_PAGINATION_LIMIT = 24;
export const booksSortByOptions = ['title', 'price', 'yearPublished', 'createdAt', 'updatedAt', 'deletedAt'] as const;


// Redis cache keys and TTLs.
export const PRICE_RANGE_CACHE_KEY = 'books:price-range';
export const PRICE_RANGE_TTL_SECONDS = 60 * 10; // 10 minutes. Redis EX = seconds. No need to multiply by 1000.
export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 100000;


export const DEFAULT_BOOK_FILTER_OPTIONS: BooksQueryOptions = {
    includeDeleted: false,
    page: 1,
    search: '',
    sortBy: 'title',
    sortOrder: 'desc',
    tags: [],
    priceRanges: {
        priceMin: DEFAULT_PRICE_MIN,
        priceMax: DEFAULT_PRICE_MAX
    },
    limit: BOOKS_PAGINATION_LIMIT,
    includePagination: true,
    randomOrder: false
};

export const HOMEPAGE_BOOK_LISTS_CAROUSEL_LIMIT = 12;

const MAX_BOOK_PRICE_FOR_HOMEPAGE_CAROUSEL = 30;
const MAX_BOOK_PAGES_FOR_HOMEPAGE_CAROUSEL = 50;

export const HOMEPAGE_BOOK_LISTS: HomepageBookListConfig[] = [
    {
        key: 'cheap', title: `Under €${MAX_BOOK_PRICE_FOR_HOMEPAGE_CAROUSEL}`,
        queryOptions: { priceRanges: { priceMin: 0, priceMax: MAX_BOOK_PRICE_FOR_HOMEPAGE_CAROUSEL } }
    },
    {
        key: 'shortReads', title: 'Short Reads', extraWhereFragment: (sqlTag) => {
            return sqlTag.fragment`
                AND books.pages <= ${MAX_BOOK_PAGES_FOR_HOMEPAGE_CAROUSEL}
            `;
        }
    },
    { key: 'classics', title: 'Classics', queryOptions: { tags: ['classics'] } },
    { key: 'actionAdventure', title: 'Action & Adventure', queryOptions: { tags: ['action & adventure'] } },
    { key: 'scifi', title: 'Science Fiction', queryOptions: { tags: ['science fiction'] } },
    { key: 'horror', title: 'Horror', queryOptions: { tags: ['horror'] } },
    { key: 'drama', title: 'Drama', queryOptions: { tags: ['drama'] } },
    { key: 'romance', title: 'Romance', queryOptions: { tags: ['romance'] } },
    { key: 'satire', title: 'Satire', queryOptions: { tags: ['satire'] } }
];