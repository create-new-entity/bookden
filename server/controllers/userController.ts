import { NextFunction, Response } from 'express';
import { ADMIN, AuthenticatedRequest, CUSTOMER, GetUsersQueryParams } from '../types';
import { AuthenticationError, UnauthorizedError } from '../errors';
import { canCreateUser, createUser, deleteUser, getAllUsers, getMySelf, getUser, updateUser } from '../services';
import { GetUsersQueryParamsSchema, UpdateUser, User } from '../validation';


const getAllUsersController = async (req: AuthenticatedRequest<GetUsersQueryParams>, res: Response, next: NextFunction) => {
    if(!req.user || req.user.userType === CUSTOMER) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }

    const validated = GetUsersQueryParamsSchema.parse(req.query);
    console.log('validated', validated);

    const allUsers = await getAllUsers();
    res.status(200).json(allUsers);
};

const getUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const user = await getUser(req.user.userId, parseInt(req.params.id, 10));  
    res.status(200).json(user);
};

const getMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const me = await getMySelf(req.user.userId);  
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

export {
    getAllUsersController,
    getUserController,
    getMeController,
    postUserController,
    patchUserController,
    deleteUserController
};