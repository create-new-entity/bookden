import { NextFunction, Response } from 'express';
import { errorMessages, errorNames } from './errorhandler';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTSignPayload } from '../types/Authentication';

export const tokenExtractor = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: errorMessages[errorNames.unauthorized] });
        return;
    }
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
                    res.status(401).json({ error: errorMessages[errorNames.tokenExpired] });
                    return;
                }
                else if(error instanceof jwt.JsonWebTokenError) {
                    res.status(401).json({ error: errorMessages[errorNames.invalidToken] });
                    return;
                }
                res.status(500).json({ error: errorMessages[errorNames.internalServerError] });
                return;
            }
        }
    }
    next();
};