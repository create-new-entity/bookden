
import { Response, NextFunction } from 'express';
import {
    AuthenticationError,
    BadRequestError,
    NotFoundError,
    errorMessages,
    errorNames
} from '../errors';
import { getAvatar, saveAvatar } from '../services';
import { AuthenticatedRequest } from '../types';

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
    const userId = req.user.userId;
    const avatar = await getAvatar(userId);
    if(!avatar) {
        throw new NotFoundError(errorMessages[errorNames.avatarNotFound]);
    }

    console.log('deleteThis', avatar);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline');
    res.end(avatar.avatar);
};

export {
    updateAvatarController,
    getAvatarController
};

/* 
    curl -X PUT -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc2MjYzODE0OSwiZXhwIjoxNzYyNzI0NTQ5fQ.53qDmOxRJ9N8c37bP1bBHgUYGBWfqltuvkAWKNZD-PE" -F "avatar=@/Users/mdimranpavel/Desktop/bookden/server/__tests__/files/batman1.jpeg" http://localhost:3000/api/avatar


    curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc2MjYzODE0OSwiZXhwIjoxNzYyNzI0NTQ5fQ.53qDmOxRJ9N8c37bP1bBHgUYGBWfqltuvkAWKNZD-PE" http://localhost:3000/api/avatar --output avatar.jpeg
*/