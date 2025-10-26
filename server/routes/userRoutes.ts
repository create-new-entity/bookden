import { Router, Request, Response, NextFunction } from 'express';
import { errorMessages, errorNames, extractDuplicateErrorMessage, isDuplicateError, tokenExtractor } from '../middlewares';
import { getAllUsers, canCreateUser, createUser, updateUser } from '../controllers';
import { UpdateUser, User } from '../validation';
import { AuthenticatedRequest } from '../types/Authentication';
import { ADMIN } from '../types';
import { isPostgresError } from '../types/Errors';
import { SlonikError } from 'slonik';

export const userBaseUrl = '/api/users';

const userRouter = Router();

userRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await getAllUsers();  
        res.json(allUsers);
    } catch (error) {
        next(error);
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

export default userRouter;
