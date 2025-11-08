import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTSignPayload } from '../types/Authentication';
import { errorMessages, errorNames } from '../errors/errorMessages';
import { AuthenticationError } from '../errors/HttpError';

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
                    const authenticationError = new AuthenticationError(errorMessages[errorNames.tokenExpired]);
                    next(authenticationError);
                    return;
                }
                else if(error instanceof jwt.JsonWebTokenError) {
                    const authenticationError = new AuthenticationError(errorMessages[errorNames.tokenInvalid]);
                    next(authenticationError);
                    return;
                }
            }
        }
    }
    next();
};