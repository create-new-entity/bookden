
import bcrypt from 'bcrypt';
import camelcaseKeys from 'camelcase-keys';

import { SALT_ROUNDS, USERS_PAGINATION_LIMIT } from '../constants';
import {
    UnauthorizedError, NotFoundError
} from '../errors';
import {
    NewUserPayload, UserTypes, JWTSignPayload,
    ADMIN, CUSTOMER, UpdateUserPayload, User,
    UserDBRow, GetUsersQueryParams, PaginatedDataList
} from '../types';
import { convertStringToSnakeCase, convertToSnakeCaseDeep, mapNumericTimeStampsToDate } from '../utilities';
import { getPGDBPool, sqlTag } from '../configs';


const mapDate = (user: UserDBRow): User => {
    const timeStamps = {
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        deletedAt: user.deleted_at
    };
    const dateStamps = mapNumericTimeStampsToDate(timeStamps);
    return {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        userType: user.user_type,
        ...dateStamps
    };
};

const getAllUsers = async (queryFilteringOptions: GetUsersQueryParams, requestorType: UserTypes): Promise<PaginatedDataList<User>> => {
    const dbPool = await getPGDBPool();

    const { search } = queryFilteringOptions;

    let userType = queryFilteringOptions.userType;
    if(requestorType === ADMIN) {
        userType = CUSTOMER;
    }
    
    const sortBy = queryFilteringOptions.sortBy ? convertStringToSnakeCase(queryFilteringOptions.sortBy): '';
    const page = (queryFilteringOptions.page && parseInt(queryFilteringOptions.page, 10)) || 1;
    const sortOrder = (queryFilteringOptions.sortOrder && queryFilteringOptions.sortOrder.toLowerCase() === 'asc') ? sqlTag.fragment`ASC`  : sqlTag.fragment`DESC`;
    const userTypeFragment = userType ? sqlTag.fragment`AND user_type=${userType}` : sqlTag.fragment``;
    const searchFragment = search ? sqlTag.fragment`
        AND (
            username ILIKE  ${'%' + search + '%'}
            OR email ILIKE  ${'%' + search + '%'}
        )` : sqlTag.fragment``;

    const defaultSortByIsNotNull = sqlTag.fragment`AND ${sqlTag.identifier(['created_at'])} IS NOT NULL`;
    const sortByIsNotNull = sqlTag.fragment`AND ${sqlTag.identifier([sortBy])} IS NOT NULL`;
    const sortByNotNull = sortBy ? sortByIsNotNull : defaultSortByIsNotNull;
    const sortByFragment = sortBy ? sqlTag.fragment`${sortByIsNotNull} ORDER BY ${sqlTag.identifier([sortBy])} ${sortOrder}` : sqlTag.fragment`${defaultSortByIsNotNull} ORDER BY ${sqlTag.identifier(['created_at'])} DESC`;
    
    const pageFragment = page ? sqlTag.fragment`OFFSET ${(page - 1) * USERS_PAGINATION_LIMIT}` : sqlTag.fragment``;


    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT user_id, username, email, user_type, created_at, updated_at, deleted_at
        FROM users
        WHERE user_type != 'superadmin'
        ${searchFragment}
        ${userTypeFragment}
        ${sortByFragment}
        LIMIT ${USERS_PAGINATION_LIMIT}
        ${pageFragment}
    `);

    const totalResult = await dbPool.one(sqlTag.typeAlias('Total')`
        SELECT COUNT(user_id)::int AS total
        FROM users
        WHERE user_type != 'superadmin'
        ${searchFragment}
        ${userTypeFragment}
        ${sortByNotNull}
    `);
    const totalUsers = totalResult.total;

    const totalPages = Math.ceil(totalUsers / USERS_PAGINATION_LIMIT);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    
    const users = result.rows;
    
    return {
        data: users.map(mapDate),
        pagination: {
            page,
            limit: USERS_PAGINATION_LIMIT,
            total: totalUsers,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    };
};

const getUser = async (requestorUser: JWTSignPayload, targetUserId: number) => {
    const dbPool = await getPGDBPool();

    const result = await dbPool.query(sqlTag.typeAlias('User')`
        SELECT username, email, user_type, user_id, created_at, updated_at, deleted_at
        FROM users
        WHERE user_id = ${targetUserId};
    `);

    const foundRow = result.rows[0];
    
    if(!foundRow) {
        const notFoundError = new NotFoundError();
        throw notFoundError;
    }

    const foundUser = mapDate(foundRow);

    const canViewUser = canViewUserInUserManagement(requestorUser.userType, foundUser.userType);
    
    if(!canViewUser) {
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

const canRestoreUser = (restorerUserType: UserTypes, targetUserType: UserTypes): boolean => {
    const hierarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN, CUSTOMER],
        admin: [CUSTOMER],
        customer: []
    };
    return hierarchy[restorerUserType].includes(targetUserType);
};

const canDeleteUser = (deletorUserType: UserTypes, targetUserType: UserTypes): boolean => {
    const hierarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN, CUSTOMER],
        admin: [CUSTOMER],
        customer: [CUSTOMER] // Deletes his own account.
    };
    return hierarchy[deletorUserType].includes(targetUserType);
};

const canViewUserInUserManagement = (requestorUserType: UserTypes, targetUserType: UserTypes): boolean => {
    const hierarchy: Record<UserTypes, UserTypes[]>= {
        superadmin: [ADMIN, CUSTOMER],
        admin: [CUSTOMER],
        customer: [] // Don't have access to user management at all.
    };
    return hierarchy[requestorUserType].includes(targetUserType);
};

const getPasswordHash = async (textPassword: string): Promise<string> => {
    return bcrypt.hash(textPassword, SALT_ROUNDS);
};

const createUser = async (newUserData: NewUserPayload) => {
    const dbPool = await getPGDBPool();
    newUserData.password = await getPasswordHash(newUserData.password);
    const snakeCasedData = convertToSnakeCaseDeep(newUserData);

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

const updateUser = async (userId: number, updateUserData: UpdateUserPayload): Promise<void> => {
    const dbPool = await getPGDBPool();
    const snakeCasedData = convertToSnakeCaseDeep(updateUserData);
    const updatedData: UpdateUserPayload = {};
    
    if(snakeCasedData.password) {
        updatedData.password = await getPasswordHash(snakeCasedData.password);
    };
    updatedData.username = snakeCasedData.username;
    updatedData.email = snakeCasedData.email;

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
        A customer can delete his own account.
        Admin can delete customer accounts.
        Superadmin is not allowed to delete himself. He can delete customer or admin users.
    */
    const customerTypeAndAllowedToDelete = (user.userType === targetUser.userType && user.userType === CUSTOMER) && (user.userId === targetUser.userId);
    const isAllowedToDelete = notSameTypeButAuthorizedToDelete || customerTypeAndAllowedToDelete;
    if(isAllowedToDelete) {
        await dbPool.query(sqlTag.typeAlias('User')`
            UPDATE users
            SET deleted_at = NOW()
            WHERE user_id = ${targetUserId}
        `);
    }
    else {
        const forbiddenActionError = new UnauthorizedError();
        throw forbiddenActionError;
    }
};

const restoreUser = async (requestorUser: JWTSignPayload, targetUserId: string): Promise<void> => {
    const dbPool = await getPGDBPool();

    const targetUserResult = await dbPool.one(sqlTag.typeAlias('User')`
        SELECT user_type
        FROM users
        WHERE user_id = ${targetUserId}
    `);

    if(!targetUserResult) {
        const notFoundError = new NotFoundError();
        throw notFoundError;
    }
    const targetUserType = targetUserResult.user_type;

    if(!canRestoreUser(requestorUser.userType, targetUserType)) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    await dbPool.query(sqlTag.typeAlias('User')`
        UPDATE users
        SET deleted_at = NULL
        WHERE user_id = ${targetUserId}
    `);
};

export {
    getAllUsers,
    getUser,
    getMyself,
    createUser,
    canCreateUser,
    canRestoreUser,
    updateUser,
    deleteUser,
    restoreUser
};