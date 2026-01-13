
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';

import { errorMessages, errorNames, AppError, ConflictError } from '../errors';
import { isPostgresError } from '../types';

export const errorHandler = ( error: unknown, _req: Request, res: Response, _next: NextFunction ) => {

    console.error(error);

    if (error instanceof ZodError) {
        return res.status(400).json({
            message: error.errors.map((err) => err.message).join(', ')
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, });
    }

    if(error instanceof MulterError) {
        return res.status(400).json({ message: error.message });
    }

    if(error instanceof ConflictError) {
        return res.status(409).json({ message: error.message });
    }

    if(isPostgresError(error)) {
        return res.status(500).json({ message: error.cause.detail });
    }
    
    return res.status(500).json({ message: errorMessages[errorNames.internalServerError] });
};
