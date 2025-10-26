import { Router, Request, Response, NextFunction } from 'express';
import { errorMessages, tokenExtractor } from '../middlewares';
import { getAllUsers, canCreateUser, createUser } from '../controllers';
import { User } from '../validation';
import { AuthenticatedRequest } from '../types/Authentication';
import { ADMIN } from '../types';

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



export default userRouter;
