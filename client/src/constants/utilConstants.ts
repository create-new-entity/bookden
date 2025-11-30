import type { UserType } from '../types';

export const NOTIFICATION_DELAY = 4000;
export const CUSTOMER = 'customer' as const;
export const ADMIN = 'admin' as const;
export const SUPERADMIN = 'superadmin' as const;

export const USERTYPE_LABELS = {
    [CUSTOMER]: 'Customer',
    [ADMIN]: 'Admin',
    [SUPERADMIN]: 'Superadmin'
} as const;


export const ASC = 'asc' as const;
export const DESC = 'desc' as const;

export const USERNAME = 'username' as const;
export const EMAIL = 'email' as const;
export const USER_TYPE = 'userType' as const;
export const CREATED_AT = 'createdAt' as const;
export const UPDATED_AT = 'updatedAt' as const;
export const DELETED_AT = 'deletedAt' as const;
export const USERS_SORT_BY_OPTIONS = [USERNAME, EMAIL, CREATED_AT, UPDATED_AT, DELETED_AT] as const;

export const ALL_TYPES_OF_USERS: UserType[] = [CUSTOMER, ADMIN, SUPERADMIN];

export const PLACE_HOLDER_AVATAR = `${import.meta.env.BASE_URL}assets/images/avatarPlaceholder.png`;

export const MAX_NUMBER_OF_RECENT_SEARCH_VALUES = 5;

export const USERS_LIST_SORT_BY_OPTIONS_TEXTS = {
    [USERNAME]: 'Username',
    [EMAIL]: 'Email',
    [CREATED_AT]: 'Latest New User',
    [UPDATED_AT]: 'Latest Updated User',
    [DELETED_AT]: 'Latest Deleted User'
} as const;

export const USER_INPUT_DELAY = 700;

export const GRID_VIEW = 'grid' as const;
export const LIST_VIEW = 'list' as const;
export const VIEW_OPTIONS = [GRID_VIEW, LIST_VIEW] as const;
