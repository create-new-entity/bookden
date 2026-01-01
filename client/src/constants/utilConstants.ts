import type { SelectOption } from '../components/custom/CustomSelect';
import type { BooksSortByOptions, UsersSortByOptions, UserType } from '../types';

export const NOTIFICATION_DELAY = 4000;
export const ALL = 'all' as const;
export const CUSTOMER = 'customer' as const;
export const ADMIN = 'admin' as const;
export const SUPERADMIN = 'superadmin' as const;

export const SELECT_USER_TYPE_OPTIONS = [ALL, CUSTOMER, ADMIN] as const;

export const USERTYPE_LABELS = {
    [CUSTOMER]: 'Customer',
    [ADMIN]: 'Admin',
    [SUPERADMIN]: 'Superadmin'
} as const;


export const ASC = 'asc' as const;
export const DESC = 'desc' as const;
export const SORT_ORDER_OPTIONS = [ASC, DESC] as const;

export const USERNAME = 'username' as const;
export const EMAIL = 'email' as const;
export const USER_TYPE = 'userType' as const;
export const CREATED_AT = 'createdAt' as const;
export const UPDATED_AT = 'updatedAt' as const;
export const DELETED_AT = 'deletedAt' as const;
export const USERS_SORT_BY_OPTIONS = [USERNAME, EMAIL, CREATED_AT, UPDATED_AT, DELETED_AT] as const;


export const TITLE = 'title' as const;
export const PRICE = 'price' as const;
export const YEAR_PUBLISHED = 'yearPublished' as const;
export const BOOKS_SORT_BY_OPTIONS = [
    TITLE, PRICE, YEAR_PUBLISHED,
    CREATED_AT, UPDATED_AT, DELETED_AT
] as const;

export const BOOKS_LIST_SORT_BY_OPTIONS_TEXTS = {
    [TITLE]: 'Title',
    [PRICE]: 'Price',
    [YEAR_PUBLISHED]: 'Year Published',
    [CREATED_AT]: 'Latest Book',
    [UPDATED_AT]: 'Latest Updated Book',
    [DELETED_AT]: 'Latest Deleted Book'
} as const;

export const BOOKS_LIST_SORT_BY_OPTIONS: Array<SelectOption<BooksSortByOptions>> = [
    { optionValue: TITLE, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[TITLE] },
    { optionValue: PRICE, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[PRICE] },
    { optionValue: YEAR_PUBLISHED, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[YEAR_PUBLISHED] },
    { optionValue: CREATED_AT, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[CREATED_AT] },
    { optionValue: UPDATED_AT, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[UPDATED_AT] },
    { optionValue: DELETED_AT, optionLabel: BOOKS_LIST_SORT_BY_OPTIONS_TEXTS[DELETED_AT] },
] as const;

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 1000;


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

export const USERS_LIST_SORT_BY_OPTIONS: Array<SelectOption<UsersSortByOptions>> = [
    { optionValue: USERNAME, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[USERNAME] },
    { optionValue: EMAIL, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[EMAIL] },
    { optionValue: CREATED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[CREATED_AT] },
    { optionValue: UPDATED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[UPDATED_AT] },
    { optionValue: DELETED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[DELETED_AT] },
];


export const USER_INPUT_DELAY = 700;

export const GRID_VIEW = 'grid' as const;
export const LIST_VIEW = 'list' as const;
export const VIEW_OPTIONS = [GRID_VIEW, LIST_VIEW] as const;

export const MIN_USERNAME_LENGTH = 6;
export const MAX_USERNAME_LENGTH = 30;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 250;
export const MIN_EMAIL_LENGTH = 6;
export const MAX_EMAIL_LENGTH = 250;