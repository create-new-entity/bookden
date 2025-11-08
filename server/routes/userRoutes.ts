import { Router, Response, NextFunction } from 'express';

import { asyncHandler, tokenExtractor } from '../middlewares';
import { getAllUsers, canCreateUser, createUser, updateUser, deleteUser, getUser } from '../services';
import { UpdateUser, User } from '../validation';
import { ADMIN, CUSTOMER, AuthenticatedRequest } from '../types';
import { AuthenticationError, UnauthorizedError } from '../errors';


export const userBaseUrl = '/api/users';

const userRouter = Router();

userRouter.get('/', tokenExtractor, asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user || req.user.userType === CUSTOMER) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const allUsers = await getAllUsers();  
    res.status(200).json(allUsers);
}));

userRouter.get('/:id', tokenExtractor, asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const unauthorizedError = new UnauthorizedError();
        next(unauthorizedError);
        return;
    }
    const allUsers = await getUser(req.user.userId, req.params.id);  
    res.status(200).json(allUsers);
}));

userRouter.post('/', tokenExtractor, asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
}));

userRouter.patch('/', tokenExtractor, asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }
    const validated = UpdateUser.parse(req.body);
    await updateUser(req.user.userId, validated);
    res.status(200).end();
}));

userRouter.delete('/:id', tokenExtractor, asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        next(loginRequiredError);
        return;
    }
    const userId = req.params.id;
    await deleteUser(userId, req.user);
    res.status(204).end();
}));

export default userRouter;
