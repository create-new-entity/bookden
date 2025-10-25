import { Router, Request, Response } from 'express';
import { errorMessages, errorNames, tokenExtractor } from '../middlewares';
import { getAllUsers, canCreateUser, createUser } from '../controllers';
import { User } from '../validation';
import { ZodError } from 'zod';
import { AuthenticatedRequest } from '../types/Authentication';
import { SlonikError } from 'slonik';
import { ADMIN } from '../types';

const userRouter = Router();

userRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const allUsers = await getAllUsers();  
        res.json(allUsers);
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

userRouter.post('/', tokenExtractor, async (req: AuthenticatedRequest, res: Response) => {
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
        if (error instanceof ZodError) {
            res.status(403).json({ message: `${errorMessages[errorNames.validationFailed]} ${error.message}`});
        }
        else if(error instanceof SlonikError) {
            res.status(400).json({ error });
        }
        else {
            res.status(500).json({ message: errorMessages[errorNames.internalServerError] });
        }
    }
});



export default userRouter;
