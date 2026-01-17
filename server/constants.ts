export const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24 hours in seconds


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