
export interface User {
    userId: string;
    username: string;
    email: string;
    userType: UserTypes;
    isActive: boolean;
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date | null;
};

export interface NewUserPayload extends Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'deletedAt'> {
    password: string;
}

export type UserTypes = 'superadmin' | 'admin' | 'customer';

export const SUPERADMIN: UserTypes = 'superadmin';
export const ADMIN: UserTypes = 'admin';
export const CUSTOMER: UserTypes = 'customer';