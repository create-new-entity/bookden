export const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24 hours in seconds


export const SALT_ROUNDS = 10;


export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 2MB
export const imageMimeTypes: readonly string[] = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'] as const;


export const sortOrderOptions = ['asc', 'desc'] as const;


export const userTypes = ['customer', 'admin', 'superadmin'] as const;
export const usersSortByOptions = ['username', 'email', 'userType', 'createdAt', 'updatedAt', 'deletedAt'] as const;
export const USERS_PAGINATION_LIMIT = 28;


export const ONE_MINUTE_IN_MILLISECONDS = 60 * 1000;
export const LOGIN_RATE_LIMIT_MAX = 30;
export const GLOBAL_RATE_LIMIT_MAX = 1000;


export const BOOKS_PAGINATION_LIMIT = 30;
export const booksSortByOptions = ['title', 'authors', 'yearPublished', 'createdAt', 'updatedAt', 'deletedAt'] as const;