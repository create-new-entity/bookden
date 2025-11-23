


import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HandlerFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;


/*
    Purpose of this middleware is to wrap the async routes in a
    try-catch block and pass the error to the next middleware.

    This is to avoid the repetitive try-catch blocks in the routes.
 */
export const asyncHandler = (fn: HandlerFn) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
