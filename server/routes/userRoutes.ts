import { Router } from 'express';

import { asyncHandler, enforceAuthentication, tokenExtractor } from '../middlewares';
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
userRouter.get('/', tokenExtractor, enforceAuthentication, asyncHandler(getAllUsersController));
userRouter.get('/me', tokenExtractor, enforceAuthentication, asyncHandler(getMeController));
userRouter.get('/:id', tokenExtractor, enforceAuthentication, asyncHandler(getUserController));
userRouter.post('/', tokenExtractor, asyncHandler(postUserController));
userRouter.patch('/', tokenExtractor, enforceAuthentication, asyncHandler(patchUserController));
userRouter.delete('/:id', tokenExtractor, enforceAuthentication, asyncHandler(deleteUserController));
userRouter.post('/:id/restore', tokenExtractor, enforceAuthentication, asyncHandler(restoreUserController));


export default userRouter;
