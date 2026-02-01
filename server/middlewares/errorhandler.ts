
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';

import { errorMessages, errorNames, AppError, ConflictError } from '../errors';
import { isPostgresError } from '../types';
import { mapPostgresErrorToAppError } from '../utilities';


export const errorHandler = ( error: unknown, _req: Request, res: Response, _next: NextFunction ) => {

    if (error instanceof multer.MulterError) {
        if(error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                message: errorMessages[errorNames.imageTooLarge]
            });
        }
        return res.status(400).json({
            message: errorMessages[errorNames.invalidFileUpload]
        });
    }

    if (error instanceof ZodError) {
        return res.status(400).json({
            message: error.errors.map((err) => err.message).join(', ')
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, });
    }

    if(error instanceof ConflictError) {
        return res.status(409).json({ message: error.message });
    }

    if (isPostgresError(error)) {
        const appError = mapPostgresErrorToAppError(error);
        return res
            .status(appError.statusCode)
            .json({ message: appError.message });
    }
    
    return res.status(500).json({ message: errorMessages[errorNames.internalServerError] });
};
