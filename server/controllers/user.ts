import configs from '../configs';
import { User } from '../types';
import { UserTypes } from '../types/User';

const sql = configs.pgDBPoolUtitlities.sql;
const sqlFragment = configs.pgDBPoolUtitlities.sqlFragment;

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

export { getAllUsers };