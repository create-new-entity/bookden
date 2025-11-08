
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Authentication';
import {
    AuthenticationError,
    BadRequestError,
    errorMessages,
    errorNames
} from '../errors';
import { saveAvatar } from '../services';

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


export {
    updateAvatarController
};
