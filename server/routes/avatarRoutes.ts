
import { Router } from 'express';
import { asyncHandler, tokenExtractor, uploadAvatar } from '../middlewares';
import { updateAvatarController } from '../controllers';

export const avatarBaseUrl = '/api/avatar';

const avatarRouter = Router();

avatarRouter.put(
    '/',
    tokenExtractor,
    uploadAvatar.single('avatar'),
    asyncHandler(updateAvatarController)
);

export default avatarRouter;
