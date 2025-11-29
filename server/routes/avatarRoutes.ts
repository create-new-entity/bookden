
import { Router } from 'express';
import { asyncHandler, tokenExtractor, uploadAvatar } from '../middlewares';
import { deleteAvatarController, getAvatarController, updateAvatarController } from '../controllers';

export const avatarBaseUrl = '/api/avatar';

const avatarRouter = Router();

avatarRouter.put(
    '/',
    tokenExtractor,
    uploadAvatar.single('avatar'),
    asyncHandler(updateAvatarController)
);

avatarRouter.get(
    '/users/:userId',
    tokenExtractor,
    asyncHandler(getAvatarController)
);

avatarRouter.get(
    '/',
    tokenExtractor,
    asyncHandler(getAvatarController)
);

avatarRouter.delete(
    '/',
    tokenExtractor,
    asyncHandler(deleteAvatarController)
);

export default avatarRouter;
