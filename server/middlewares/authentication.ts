import { NextFunction, Response } from 'express';
import { errorMessages, errorNames } from './errorhandler';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTSignPayload } from '../types/Authentication';

export const tokenExtractor = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
                req.user = decoded as JWTSignPayload;
                next();
                return;
            }
            catch(error) {
                if(error instanceof jwt.TokenExpiredError) {
                    error.message = errorMessages[errorNames.tokenExpired];
                    next(error);
                    return;
                }
                else if(error instanceof jwt.JsonWebTokenError) {
                    error.message = errorMessages[errorNames.invalidToken];
                    next(error);
                    return;
                }
                next(error);
                return;
            }
        }
    }
    next();
};