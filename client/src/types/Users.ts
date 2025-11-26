
export type UserType = 'superadmin' | 'admin' | 'customer';

export type User = {
    userId: number;
    username: string;
    email: string;
    userType: UserType;
    createdAt: string;
};