
import { Response, NextFunction } from 'express';
import {
    AuthenticationError,
    BadRequestError,
    NotFoundError,
    errorMessages,
    errorNames
} from '../errors';
import { deleteAvatar, getAvatar, saveAvatar } from '../services';
import { AuthenticatedRequest } from '../types';
import camelcaseKeys from 'camelcase-keys';

/* 

    To easily test from terminal:
    ( save an image in /Users/mdimranpavel/Desktop/bookden/server/__tests__/files first )

    1. Send PUT request like this to save the avatar:
        curl -X PUT \
            -H "Authorization: Bearer <token>" \
            -F "avatar=@/Users/mdimranpavel/Desktop/bookden/server/__tests__/files/batman1.jpeg" \
            http://localhost:3000/api/avatar

    2. Send GET request like this to get the avatar:
        curl -H "Authorization: Bearer <token>" \
            http://localhost:3000/api/avatar \
            --output avatar.jpeg

    3. Send DELETE request like this to delete the avatar:
        curl -X DELETE \
            -H "Authorization: Bearer <token>" \
            http://localhost:3000/api/avatar

*/

const updateAvatarController = async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new AuthenticationError();
    }

    if (!req.file) {
        throw new BadRequestError(errorMessages[errorNames.noFileUploaded]);
    }

    const { buffer, mimetype } = req.file;
    const userId = req.user.userId;
    
    await saveAvatar(userId, buffer, mimetype);

    res.status(200).end();
    return;
};

const getAvatarController = async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new AuthenticationError();
    }
    const requestorUserId = req.user.userId;

    let targetUserId = requestorUserId;
    if(req.params.userId) {
        targetUserId = parseInt(req.params.userId, 10); // It means the requestor wants to get the avatar of another user.
    }

    const avatars = await getAvatar(targetUserId);
    const avatar = camelcaseKeys(avatars.rows[0], { deep: true });

    if(!avatar) {
        throw new NotFoundError(errorMessages[errorNames.avatarNotFound]);
    }

    const responseHeaders = {
        'Content-Type': avatar.mimeType,
        'Content-Disposition': 'inline', // Browser should try to display it inside the browser window
    };

    res.set(responseHeaders);
    res.end(avatar.avatar);
};

const deleteAvatarController = async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
        throw new AuthenticationError();
    }
    const userId = req.user.userId;
    await deleteAvatar(userId);

    res.status(200).end();
};

export {
    updateAvatarController,
    getAvatarController,
    deleteAvatarController
};
