import type { SELECT_USER_TYPE_OPTIONS, USERS_LIST_SORT_BY_OPTIONS_TEXTS } from '../constants';
import type { SortOrder } from './UtilTypes';

export type SuperAdmin = 'superadmin';
export type Admin = 'admin';
export type Customer = 'customer';
export type AdminOrCustomer = Admin | Customer;

export type UserType = SuperAdmin | Admin | Customer;

export type User = {
    userId: number;
    username: string;
    email: string;
    userType: UserType;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

export type UsersSortByOptions = keyof typeof USERS_LIST_SORT_BY_OPTIONS_TEXTS;

export type UserTypeOptions = (typeof SELECT_USER_TYPE_OPTIONS)[number];
export type UsersListLocalOptions = {
    search: string;
    page: number;
    sortBy: UsersSortByOptions;
    sortOrder: SortOrder;
    userType: UserTypeOptions;

    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setSortBy: React.Dispatch<React.SetStateAction<UsersSortByOptions>>;
    setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
    setUserType: React.Dispatch<React.SetStateAction<UserType>>;
};


export type CreateUserPayload = {
    username: string;
    email: string;
    password: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export type CreateOrUpdateFormFields = Pick<CreateUserPayload, 'username' | 'email' | 'password'> & {
    confirmPassword: string;
};

export type CreateOrUpdateUserMode = 'update' | 'create';
