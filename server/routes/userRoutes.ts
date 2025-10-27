import { Router, Response, NextFunction } from 'express';
import { errorMessages, errorNames, extractDuplicateErrorMessage, isDuplicateError, tokenExtractor } from '../middlewares';
import { getAllUsers, canCreateUser, createUser, updateUser, deleteUser, getUser } from '../controllers';
import { UpdateUser, User } from '../validation';
import { AuthenticatedRequest } from '../types/Authentication';
import { ADMIN, CUSTOMER } from '../types';
import { isPostgresError } from '../types/Errors';
import { SlonikError } from 'slonik';

export const userBaseUrl = '/api/users';

const userRouter = Router();

userRouter.get('/', tokenExtractor, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user || req.user.userType === CUSTOMER) {
            const unauthorizedError = new Error(errorMessages[errorNames.unauthorized]);
            throw unauthorizedError;
        }
        const allUsers = await getAllUsers();  
        res.status(200).json(allUsers);
    } catch (error) {
        next(error);
    }
});

userRouter.get('/:id', tokenExtractor, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            const unauthorizedError = new Error(errorMessages[errorNames.unauthorized]);
            unauthorizedError.name = errorNames.unauthorized;
            throw unauthorizedError;
        }
        const allUsers = await getUser(req.user.userId, req.params.id);  
        res.status(200).json(allUsers);
    } catch (error) {
        if(error instanceof SlonikError) {
            // Want to set a cleaner error message.
            const userNotFoundError = new Error(errorMessages[errorNames.userNotFound]);
            userNotFoundError.name = errorNames.userNotFound;
            next(userNotFoundError);
        }
        else {
            next(error);
        }
    }
});

userRouter.post('/', tokenExtractor, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        let creatorUserType;
        const validated = User.parse(req.body);
        if(req.user) {
            creatorUserType = req.user.userType;
            if(!canCreateUser(creatorUserType, validated.userType)) {
                res.status(403).json({ message: errorMessages.notAllowedToCreateUser });
                return;
            }
        }

        /*
            An admin user can only be created if it is requested by the superadmin user.
        */
        if(!req.user && validated.userType === ADMIN) {
            res.status(403).json({ message: errorMessages.notAllowedToCreateUser });
            return;
        }
        await createUser(validated);
        res.status(201).end();
    } catch (error) {
        next(error);
    }
});

userRouter.put('/', tokenExtractor, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            const unauthorizedError = new Error(errorMessages[errorNames.unauthorized]);
            throw unauthorizedError;
        }
        const validated = UpdateUser.parse(req.body);
        await updateUser(req.user.userId, validated);
        res.status(200).end();
    }
    catch(e) {
        if(isPostgresError(e)) {
            const isUniqueConstraintErr = isDuplicateError(e);
            if(isUniqueConstraintErr) {
                e.message = extractDuplicateErrorMessage(e);
                next(e);
                return;
            }
        }
        next(e);
    }
});

userRouter.delete('/:id', tokenExtractor, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if(!req.user) {
            const unauthorizedError = new Error(errorMessages[errorNames.unauthorized]);
            unauthorizedError.name = errorNames.unauthorized;
            throw unauthorizedError;
        }
        const userId = req.params.id;
        await deleteUser(userId, req.user);
        res.status(204).end();
    }
    catch(error) {
        if(error instanceof SlonikError) {
            // Want to set a cleaner error message.
            const userNotFoundError = new Error(errorMessages[errorNames.userNotFound]);
            userNotFoundError.name = errorNames.userNotFound;
            next(userNotFoundError);
        }
        else {
            next(error);
        }
    }
});

export default userRouter;
