import { NextFunction, Response } from 'express';
import { errorMessages, errorNames } from './errorhandler';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JWTSignPayload } from '../types/Authentication';
import { CUSTOMER } from '../types';

export const tokenExtractor = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const isCreatingCustomerUser = req.body.userType === CUSTOMER;
    if(isCreatingCustomerUser) {
        next();
        return;
    }
    if (!authHeader) {
        res.status(401).json({ error: errorMessages[errorNames.unauthorized] });
        return;
    }
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ error: errorMessages[errorNames.tokenMissing] });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as JWTSignPayload;
    } catch(error) {
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
    next();
};