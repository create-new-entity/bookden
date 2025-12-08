

import multer from 'multer';
import { Request } from 'express';

import { imageMimeTypes, MAX_FILE_SIZE } from '../constants';
import { UnsupportedMediaTypeError } from '../errors';

const storage = multer.memoryStorage(); // Save in memory temporarily

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = imageMimeTypes;
    const isFileTypeCorrect = allowedTypes.includes(file.mimetype);
    if(isFileTypeCorrect) {
        cb(null, true);
        return;
    }
    cb(new UnsupportedMediaTypeError());
};

export const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
});
