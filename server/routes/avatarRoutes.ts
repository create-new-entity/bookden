
import { Router } from 'express';

import { asyncHandler, tokenExtractor, uploadImage, enforceAuthentication } from '../middlewares';
import { deleteAvatarController, getAvatarController, updateAvatarController } from '../controllers';

export const avatarBaseUrl = '/api/avatar';

const avatarRouter = Router();

avatarRouter.put(
    '/',
    tokenExtractor,
    enforceAuthentication,
    uploadImage.single('avatar'),
    asyncHandler(updateAvatarController)
);

avatarRouter.get(
    '/users/:userId',
    tokenExtractor,
    enforceAuthentication,
    asyncHandler(getAvatarController)
);

avatarRouter.get(
    '/',
    tokenExtractor,
    enforceAuthentication,
    asyncHandler(getAvatarController)
);

avatarRouter.delete(
    '/',
    tokenExtractor,
    enforceAuthentication,
    asyncHandler(deleteAvatarController)
);

export default avatarRouter;
