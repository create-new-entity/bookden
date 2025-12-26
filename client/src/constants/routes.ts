

export const HOME = '/' as const;
export const UPDATE_PROFILE = '/update-profile' as const;
export const USER_MANAGEMENT = '/user-management' as const;
export const ADMIN_TOOLS = '/admin-tools' as const;
export const BOOK_MANAGEMENT = '/book-management' as const;
export const AUTH = '/auth' as const;
export const USER = '/users/:userId' as const;
export const CREATE_ADMIN_USER = '/create-admin-user' as const;

export const ALL_ROUTES = [HOME, UPDATE_PROFILE, USER_MANAGEMENT, ADMIN_TOOLS, AUTH, CREATE_ADMIN_USER] as const;
