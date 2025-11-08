
import bcrypt from 'bcrypt';

import configs from '../configs';
import { SALT_ROUNDS } from '../constants';
import {
    errorMessages,
    errorNames,
    ConflictError,
    UnauthorizedError
} from '../errors';
import {
    NewUserPayload,
    UserTypes,
    JWTSignPayload,
    ADMIN, CUSTOMER, UpdateUserPayload, User
} from '../types';
import { convertToSnakeCaseDeep } from '../utilities';

const { sqlOne, sqlMayBeOne, sql, sqlFragment } = configs.pgDBPoolUtitlities.queryVariants;

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

const getUser = async (requestorUserId: string, targetUserId: string) => {
    const foundUser = await sqlOne`
        SELECT username, email, user_type, user_id
        FROM users
        WHERE user_id = ${targetUserId};
    `;
    if(foundUser.userId !== requestorUserId) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }
    return foundUser;
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
        INSERT INTO users (username, password_hash, email, user_type)
        VALUES (${snakeCasedData.username}, ${snakeCasedData.password}, ${snakeCasedData.email}, ${snakeCasedData.user_type})
    `;
};

const checkDuplicateUsername = async (userId: string, username: string): Promise<void> => {
    const found = await sqlMayBeOne`
        SELECT 1
        FROM users u
        WHERE
            u.username = ${username}
            AND u.user_id != ${userId}
    `;
    if(found) {
        const userNameNotAvailableError = new ConflictError(errorMessages[errorNames.usernameNotAvailable]);
        throw userNameNotAvailableError;
    }
};

const checkDuplicateEmail = async (userId: string, email: string): Promise<void> => {
    const found = await sqlMayBeOne`
        SELECT 1
        FROM users u
        WHERE
            u.email = ${email}
            AND u.user_id != ${userId}
    `;
    if(found) {
        const emailIsNotAvailableError = new ConflictError(errorMessages[errorNames.emailNotAvailable]);
        throw emailIsNotAvailableError;
    }
};

const updateUser = async (userId: string, updateUserData: UpdateUserPayload): Promise<void> => {
    const snakeCasedData = convertToSnakeCaseDeep(updateUserData);
    const updatedData: UpdateUserPayload = {};
    
    if(snakeCasedData.password) {
        updatedData.password = await getPasswordHash(snakeCasedData.password);
    };
    updatedData.username = snakeCasedData.username;

    // Unique constraints are there. Want to have better error messaging though.
    if(updatedData.username) {
        await checkDuplicateUsername(userId, updatedData.username);
    }
    updatedData.email = snakeCasedData.email;
    if(updatedData.email) {
        await checkDuplicateEmail(userId, updatedData.email);
    }

    await sqlMayBeOne`
        UPDATE users
        SET
            username = COALESCE(${updatedData.username || null}, username),
            email = COALESCE(${updatedData.email || null}, email),
            password_hash = COALESCE(${updatedData.password || null}, password_hash),
            updated_at = NOW()
        WHERE user_id = ${userId};
    `;
};

const deleteUser = async (targetUserId: string, user: JWTSignPayload): Promise<void> => {
    const targetUser = await sqlOne`
        SELECT user_id, username, user_type
        FROM users
        WHERE users.user_id = ${targetUserId}
        AND deleted_at IS NULL;
    `;
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
        const forbiddenActionError = new UnauthorizedError();
        throw forbiddenActionError;
    }
};

export {
    getAllUsers,
    getUser,
    createUser,
    canCreateUser,
    updateUser,
    deleteUser
};