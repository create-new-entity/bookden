import { NextFunction, Response } from 'express';
import { ADMIN, AuthenticatedRequest, CUSTOMER, GetUsersQueryParams, SUPERADMIN } from '../types';
import { AuthenticationError, UnauthorizedError } from '../errors';
import { canCreateUser, createUser, deleteUser, getAllUsers, getMyself, getUser, restoreUser, updateUser } from '../services';
import { GetUsersQueryParamsSchema, UpdateUser, User } from '../validation';


const getAllUsersController = async (req: AuthenticatedRequest<GetUsersQueryParams>, res: Response, next: NextFunction) => {
    if(!req.user || req.user.userType === CUSTOMER) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }

    const queryFilteringOptions = GetUsersQueryParamsSchema.parse(req.query);
    const allUsers = await getAllUsers(queryFilteringOptions, req.user.userType);
    res.status(200).json(allUsers);
};

const getUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const user = await getUser(req.user, parseInt(req.params.id, 10));  
    res.status(200).json(user);
};

const getMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const me = await getMyself(req.user.userId);  
    res.status(200).json(me);
};

const postUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let creatorUserType;
    const validated = User.parse(req.body);
    if(req.user) {
        creatorUserType = req.user.userType;
        if(!canCreateUser(creatorUserType, validated.userType)) {
            const unauthorizedError = new UnauthorizedError();
            next(unauthorizedError);
            return;
        }
    }

    /*
        An admin user can only be created if it is requested by the superadmin user.
    */
    if(!req.user && validated.userType === ADMIN) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }
    await createUser(validated);
    res.status(201).end();
};

const patchUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }
    const validated = UpdateUser.parse(req.body);

    const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';
    const isSuperAdmin = req.user.userType === SUPERADMIN;

    if(isSuperAdmin &&!isDevelopmentEnvironment) {
        /*
            Note to future self:

            If the user is a superadmin and the environment is not development, do not update the password.
            Why?
            Because it is a portfolio project and I want any potential employer browsing the app
            be able to access the features. No one should be able to change the superadmin password. In that case,
            some other person browsing the app won't be able to access the features.
         */
        validated.username = undefined;
        validated.password = undefined;
    }

    await updateUser(req.user.userId, validated);
    res.status(200).end();
};

const deleteUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }
    const userId = req.params.id;
    await deleteUser(userId, req.user);
    res.status(204).end();
};

const restoreUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }

    const userId = req.params.id;
    await restoreUser(req.user, userId);
    res.status(200).end();
};

export {
    getAllUsersController,
    getUserController,
    getMeController,
    postUserController,
    patchUserController,
    deleteUserController,
    restoreUserController
};