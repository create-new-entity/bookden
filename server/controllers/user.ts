import configs from '../configs';
import { SALT_ROUNDS } from '../constants';
import { ADMIN, User } from '../types';
import { NewUserPayload, UserTypes } from '../types';
import { convertToSnakeCaseDeep } from '../utilities';
import bcrypt from 'bcrypt';

const { sql, sqlFragment } = configs.pgDBPoolUtitlities.queryVariants;

const mapDate = (user: User): User => {
    return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
        deletedAt: user.deletedAt ? new Date(user.deletedAt) : null,
    };
};

const getAllUsers = async (userType?: UserTypes | undefined): Promise<User[]> => {
    const users = await sql`
        SELECT
            user_id,
            username,
            email,
            user_type,
            created_at,
            updated_at,
            deleted_at
        FROM users
        WHERE deleted_at IS NULL
        ${userType ? sqlFragment`AND user_type='${userType}'` : sqlFragment``}
    `;
    return users.map(mapDate);
};

const canCreateUser = (creatorUserType: UserTypes, targetUserType: UserTypes): boolean => {
    /*
         Superadmin can create Admins.
         Admins don't create anyone.
         Customers will sign up themselves.

         If the create request is coming from an authenticated
         user, they have tobe superadmin and they should be
         creating an admin.
     */
    const hierrarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN],
        admin: [],
        customer: [],
    };
    return hierrarchy[creatorUserType].includes(targetUserType);
};

const createUser = async (newUserData: NewUserPayload) => {
    newUserData.password = await bcrypt.hash(newUserData.password, SALT_ROUNDS);
    const snakeCasedData = convertToSnakeCaseDeep(newUserData);
    await sql`
        INSERT INTO users (username, password_hash, email, user_type, is_active)
        VALUES (${snakeCasedData.username}, ${snakeCasedData.password}, ${snakeCasedData.email}, ${snakeCasedData.user_type}, ${snakeCasedData.is_active})
    `;
};

export { getAllUsers, createUser, canCreateUser };