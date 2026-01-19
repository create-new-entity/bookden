import { Router } from 'express';

import { asyncHandler, tokenExtractor } from '../middlewares';
import {
    deleteUserController,
    getAllUsersController,
    getMeController,
    getUserController,
    patchUserController,
    postUserController,
    restoreUserController
} from '../controllers';


export const userBaseUrl = '/api/users';

const userRouter = Router();
userRouter.get('/', tokenExtractor, asyncHandler(getAllUsersController));
userRouter.get('/me', tokenExtractor, asyncHandler(getMeController));
userRouter.get('/:id', tokenExtractor, asyncHandler(getUserController));
userRouter.post('/', tokenExtractor, asyncHandler(postUserController));
userRouter.patch('/', tokenExtractor, asyncHandler(patchUserController));
userRouter.delete('/:id', tokenExtractor, asyncHandler(deleteUserController));
userRouter.post('/:id/restore', tokenExtractor, asyncHandler(restoreUserController));


export default userRouter;
