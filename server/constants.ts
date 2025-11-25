
export const SALT_ROUNDS = 10;
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const avatarMimeTypes = ['image/png', 'image/jpeg', 'image/webp'] as const;
export const TOKEN_VALIDITY_SECONDS = 24 * 60 * 60; // 24 hours in seconds
export const userTypes = ['customer', 'admin', 'superadmin'] as const;
export const usersSortOrderOptions = ['asc', 'desc'] as const;
export const usersSortByOptions = ['username', 'email', 'userType', 'createdAt'] as const;
export const USERS_PAGINATION_LIMIT = 10;