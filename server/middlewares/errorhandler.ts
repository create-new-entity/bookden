
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';
import { errorMessages, errorNames } from '../errors/errorMessages';

export const errorHandler = ( err: unknown, _req: Request, res: Response, _next: NextFunction ) => {

    console.error(err);

    if (err instanceof ZodError) {
        const formatted = err.errors.reduce((acc, curr) => {
            return `${acc}, ${curr.message}`;
        }, '');
        return res.status(400).json({
            message: `${errorMessages[errorNames.validationFailed]} ${formatted}`,
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message, });
    }
    
    return res.status(500).json({ message: 'Internal Server Error' });
};
