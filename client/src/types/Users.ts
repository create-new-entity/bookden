import type { USERS_LIST_SORT_BY_OPTIONS_TEXTS } from '../constants';
import type { Pagination } from './Pagination';
import type { SortOrder } from './UtilTypes';

export type UserType = 'superadmin' | 'admin' | 'customer';

export type User = {
    userId: number;
    username: string;
    email: string;
    userType: UserType;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    avatarUrl?: string;
};

export type UserTypeOptions = UserType | 'all';
export type UsersListLocalOptions = {
    search: string;
    page: number;
    sortBy: SortByOptions;
    sortOrder: SortOrder;
    userType: UserTypeOptions;

    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setSortBy: React.Dispatch<React.SetStateAction<SortByOptions>>;
    setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
    setUserType: React.Dispatch<React.SetStateAction<UserType>>;
};

export type SortByOptions = keyof typeof USERS_LIST_SORT_BY_OPTIONS_TEXTS;

export type PaginatedUsers = {
    users: User[];
    pagination: Pagination;
};