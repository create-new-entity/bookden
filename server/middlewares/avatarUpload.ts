

import multer from 'multer';
import { Request } from 'express';
import { UnsupportedMediaTypeError } from '../errors/HttpError';
import { MAX_FILE_SIZE } from '../constants';

const storage = multer.memoryStorage(); // Save in memory temporarily

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isFileTypeCorrect = allowedTypes.includes(file.mimetype);
    if(isFileTypeCorrect) {
        cb(null, true);
        return;
    }
    cb(new UnsupportedMediaTypeError());
};

export const uploadAvatar = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});
