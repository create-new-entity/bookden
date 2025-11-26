
import bcrypt from 'bcrypt';
import camelcaseKeys from 'camelcase-keys';

import { SALT_ROUNDS, USERS_PAGINATION_LIMIT } from '../constants';
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
    ADMIN, CUSTOMER, UpdateUserPayload, User,
    UserDBRow,
    GetUsersQueryParams
} from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep } from '../utilities';
import { getPGDBPool, sqlTag } from '../configs';


const mapDate = (user: UserDBRow): User => {
    return {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        userType: user.user_type,
        createdAt: new Date(user.created_at),
        updatedAt: user.updated_at ? new Date(user.updated_at) : null,
        deletedAt: user.deleted_at ? new Date(user.deleted_at) : null
    };
};

const getAllUsers = async (queryFilteringOptions: GetUsersQueryParams): Promise<User[]> => {
    const dbPool = await getPGDBPool();

    const { userType, search } = queryFilteringOptions;
    const sortBy = queryFilteringOptions.sortBy ? convertStringToSnakeCase(queryFilteringOptions.sortBy): '';
    const page = (queryFilteringOptions.page && parseInt(queryFilteringOptions.page, 10)) || 1;
    const sortOrder = (queryFilteringOptions.sortOrder && queryFilteringOptions.sortOrder.toLowerCase() === 'asc') ? sqlTag.fragment`ASC`  : sqlTag.fragment`DESC`;
    const userTypeFragment = userType ? sqlTag.fragment`AND user_type=${userType}` : sqlTag.fragment``;
    const searchFragment = search ? sqlTag.fragment`
        AND (
            username ILIKE  ${'%' + search + '%'}
            OR email ILIKE  ${'%' + search + '%'}
        )` : sqlTag.fragment``;
    const sortByFragment = sortBy ? sqlTag.fragment`ORDER BY ${sqlTag.identifier([sortBy])} ${sortOrder}` : sqlTag.fragment`ORDER BY created_at DESC`;
    const pageFragment = page ? sqlTag.fragment`OFFSET ${(page - 1) * USERS_PAGINATION_LIMIT}` : sqlTag.fragment``;


    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT user_id, username, email, user_type, created_at
        FROM users
        WHERE deleted_at IS NULL
        ${searchFragment}
        ${userTypeFragment}
        ${sortByFragment}
        LIMIT ${USERS_PAGINATION_LIMIT}
        ${pageFragment}
    `);
    

    const users = result.rows;
    return users.map(mapDate);
};

const getUser = async (requestorUserId: number, targetUserId: number) => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT username, email, user_type, user_id
        FROM users
        WHERE user_id = ${targetUserId};
    `);

    const foundUser = camelcaseKeys(result.rows[0], { deep: true });
    
    if(foundUser.userId !== requestorUserId) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }
    return foundUser;
};

const getMyself = async (requestorUserId: number) => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT username, email, user_type, user_id
        FROM users
        WHERE user_id = ${requestorUserId};
    `);

    const foundUser = camelcaseKeys(result.rows[0], { deep: true });
    
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
    const hierarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN],
        admin: [],
        customer: [],
    };
    return hierarchy[creatorUserType].includes(targetUserType);
};

const canDeleteUser = (deletorUserType: UserTypes, targetUserType: UserTypes): boolean => {
    const hierarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN, CUSTOMER],
        admin: [CUSTOMER],
        customer: [],
    };
    return hierarchy[deletorUserType].includes(targetUserType);
};

const getPasswordHash = async (textPassword: string): Promise<string> => {
    return bcrypt.hash(textPassword, SALT_ROUNDS);
};

const createUser = async (newUserData: NewUserPayload) => {
    const dbPool = await getPGDBPool();
    newUserData.password = await getPasswordHash(newUserData.password);
    const snakeCasedData = convertToSnakeCaseDeep(newUserData);

    // Unique constraints are there. Want to have better error messaging though.
    await checkDuplicateUsername(snakeCasedData.username);
    await checkDuplicateEmail(snakeCasedData.email);
    
    await dbPool.query(sqlTag.typeAlias('User')`
        INSERT INTO users (username, password_hash, email, user_type)
        VALUES (
            ${snakeCasedData.username},
            ${snakeCasedData.password},
            ${snakeCasedData.email},
            ${snakeCasedData.user_type}
        )
    `);
};

const checkDuplicateUsername = async (username: string, userId?: number): Promise<void> => {
    const dbPool = await getPGDBPool();

    const userIdFragment = userId ? sqlTag.fragment`AND u.user_id != ${userId}` : sqlTag.fragment``;

    const found = await dbPool.maybeOne(sqlTag.typeAlias('User')`
        SELECT 1
        FROM users u
        WHERE
            u.username = ${username}
            ${userIdFragment}
    `);
    
    if(found) {
        const userNameNotAvailableError = new ConflictError(errorMessages[errorNames.usernameNotAvailable]);
        throw userNameNotAvailableError;
    }
};

const checkDuplicateEmail = async (email: string, userId?: number): Promise<void> => {
    const dbPool = await getPGDBPool();

    const userIdFragment = userId ? sqlTag.fragment`AND u.user_id != ${userId}` : sqlTag.fragment``;

    const found = await dbPool.maybeOne(sqlTag.typeAlias('User')`
        SELECT 1
        FROM users u
        WHERE
            u.email = ${email}
            ${userIdFragment}
    `);
    
    if(found) {
        const emailIsNotAvailableError = new ConflictError(errorMessages[errorNames.emailNotAvailable]);
        throw emailIsNotAvailableError;
    }
};

const updateUser = async (userId: number, updateUserData: UpdateUserPayload): Promise<void> => {
    const dbPool = await getPGDBPool();
    const snakeCasedData = convertToSnakeCaseDeep(updateUserData);
    const updatedData: UpdateUserPayload = {};
    
    if(snakeCasedData.password) {
        updatedData.password = await getPasswordHash(snakeCasedData.password);
    };
    updatedData.username = snakeCasedData.username;

    // Unique constraints are there. Want to have better error messaging though.
    if(updatedData.username) {
        await checkDuplicateUsername(updatedData.username, userId);
    }
    updatedData.email = snakeCasedData.email;
    if(updatedData.email) {
        await checkDuplicateEmail(updatedData.email, userId);
    }


    await dbPool.query(sqlTag.typeAlias('User')`
        UPDATE users
        SET
            username = COALESCE(${updatedData.username || null}, username),
            email = COALESCE(${updatedData.email || null}, email),
            password_hash = COALESCE(${updatedData.password || null}, password_hash),
            updated_at = NOW()
        WHERE user_id = ${userId};
    `);
};

const deleteUser = async (targetUserId: string, user: JWTSignPayload): Promise<void> => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.one(sqlTag.typeAlias('User')`
        SELECT user_id, username, user_type
        FROM users
        WHERE users.user_id = ${targetUserId}
        AND deleted_at IS NULL;
    `);

    const targetUser = camelcaseKeys(result, { deep: true });
    
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
            await dbPool.query(sqlTag.typeAlias('User')`
                UPDATE users
                SET deleted_at = NOW()
                WHERE user_id = ${targetUserId}
            `);
        }
        else {
            await dbPool.query(sqlTag.typeAlias('User')`
                DELETE FROM users
                WHERE user_id = ${targetUserId};
            `);
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
    getMyself,
    createUser,
    canCreateUser,
    updateUser,
    deleteUser
};