
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { errorMessages, errorNames, AppError } from '../errors';
import { MulterError } from 'multer';

export const errorHandler = ( error: unknown, _req: Request, res: Response, _next: NextFunction ) => {

    console.error(error);

    if (error instanceof ZodError) {
        const formatted = error.errors.map(e => e.message).join(', ');
        return res.status(400).json({
            message: `${errorMessages[errorNames.validationFailed]}: ${formatted}`,
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message, });
    }

    if(error instanceof MulterError) {
        return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ message: errorMessages[errorNames.internalServerError] });
};
