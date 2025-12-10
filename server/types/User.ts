import { z } from 'zod';
import { CamelCaseDeep } from './Utilities';
import { GetUsersQueryParamsSchema } from '../validation';
import { UserTypeAlias } from '../typeAliases';


export type UserDBRow = z.infer<typeof UserTypeAlias>;

/* 
    Need UserTypeAlias to create UserDBRow for sqlTags.
    Need User below to cast date values to Date types, which can be
    correctly used by mapDate.

    Without this, followings' types are incompatible:
    1. Data got out from db
    2. Data after transformation using mapDate
*/


export type User = CamelCaseDeep<Omit<UserDBRow, 'created_at' | 'updated_at' | 'deleted_at' | 'password_hash'>> & {
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
};


export interface NewUserPayload extends Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    password: string;
};

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    password?: string;
};

export type UserTypes = 'superadmin' | 'admin' | 'customer';

export const SUPERADMIN: UserTypes = 'superadmin';
export const ADMIN: UserTypes = 'admin';
export const CUSTOMER: UserTypes = 'customer';

export type GetUsersQueryParams = z.infer<typeof GetUsersQueryParamsSchema>;