
export type User = {
    userId: string;
    username: string;
    email: string;
    userType: UserTypes;
    isActive: boolean;
    createdAt: Date;
    deletedAt: Date | null;
    updatedAt: Date | null;
};

export type UserTypes = 'superadmin' | 'admin' | 'customer';