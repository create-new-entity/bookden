

export const HOME = '/' as const;
export const PROFILE = '/profile' as const;
export const USER_MANAGEMENT = '/user-management' as const;
export const ADMIN_TOOLS = '/admin-tools' as const;
export const AUTH = '/auth' as const;
export const USER = '/users/:userId' as const;

export const ALL_ROUTES = [HOME, PROFILE, USER_MANAGEMENT, ADMIN_TOOLS, AUTH] as const;
