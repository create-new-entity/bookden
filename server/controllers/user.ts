import configs from '../configs';
import { SALT_ROUNDS } from '../constants';
import { errorMessages, errorNames } from '../middlewares';
import { ADMIN, CUSTOMER, UpdateUserPayload, User } from '../types';
import { NewUserPayload, UserTypes } from '../types';
import { JWTSignPayload } from '../types/Authentication';
import { convertToSnakeCaseDeep } from '../utilities';
import bcrypt from 'bcrypt';

const { sqlOne, sql, sqlFragment } = configs.pgDBPoolUtitlities.queryVariants;

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

const canDeleteUser = (deletorUserType: UserTypes, targetUserType: UserTypes): boolean => {
    const hierrarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN, CUSTOMER],
        admin: [CUSTOMER],
        customer: [],
    };
    return hierrarchy[deletorUserType].includes(targetUserType);
};

const getPasswordHash = async (textPassword: string): Promise<string> => {
    return bcrypt.hash(textPassword, SALT_ROUNDS);
};

const createUser = async (newUserData: NewUserPayload) => {
    newUserData.password = await getPasswordHash(newUserData.password);
    const snakeCasedData = convertToSnakeCaseDeep(newUserData);
    await sql`
        INSERT INTO users (username, password_hash, email, user_type, is_active)
        VALUES (${snakeCasedData.username}, ${snakeCasedData.password}, ${snakeCasedData.email}, ${snakeCasedData.user_type}, ${snakeCasedData.is_active})
    `;
};

const updateUser = async (userId: string, updateUserData: UpdateUserPayload): Promise<void> => {
    const snakeCasedData = convertToSnakeCaseDeep(updateUserData);
    snakeCasedData.password = await getPasswordHash(updateUserData.password);
    await sqlOne`
        UPDATE users
        SET
            username = ${snakeCasedData.username},
            password_hash = ${snakeCasedData.password},
            email = ${snakeCasedData.email}
        WHERE
            user_id = ${userId}
        RETURNING *;
    `;
};

const deleteUser = async (targetUserId: string, user: JWTSignPayload): Promise<void> => {
    const targetUser = await sqlOne`
        SELECT user_id, username, user_type
        FROM users
        WHERE users.user_id = ${targetUserId}
        AND deleted_at IS NULL;
    `;
    console.log('targetUser', targetUser);
    const notSameTypeUser = user.userType !== targetUser.userType;
    const notSameTypeButAuthorizedToDelete = notSameTypeUser && canDeleteUser(user.userType, targetUser.userType);
    
    /* 
        Only a customer can delete his own account.
        Admin can delete customer accounts.
        Superadmin is not allowed to delete himself. He can delete customer or admin users.
    */
    const customerTypeAndAllowedToDelete = (user.userType === targetUser.userType && user.userType === CUSTOMER) && (user.userId === targetUser.userId);
    const isAllowedToDelete = notSameTypeButAuthorizedToDelete || customerTypeAndAllowedToDelete;
    if(isAllowedToDelete) {
        if(customerTypeAndAllowedToDelete) {
            await sql`
                UPDATE users
                SET deleted_at = NOW()
                WHERE user_id = ${targetUserId}
            `;
        }
        else {
            await sql`
                DELETE FROM users
                WHERE user_id = ${targetUserId};
            `;
        }
    }
    else {
        const forbiddenActionError = new Error(errorMessages[errorNames.forbiddenAction]);
        forbiddenActionError.name = errorNames.forbiddenAction;
        throw forbiddenActionError;
    }
};

export {
    getAllUsers,
    createUser,
    canCreateUser,
    updateUser,
    deleteUser
};