import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthenticatedRequest, JWTSignPayload } from '../types';
import { AuthenticationError, errorMessages, errorNames } from '../errors';
import { getPGDBPool, sqlTag } from '../configs';

export const validTokenIsNotRequired = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    /*
        This is related to how we decide whether "includeDeleted" should be taken into account or not,
        later in the controller / service fns.

        Also in some cases, even if the token has expired we don't necessarily need to throw an error. ( public endpoints )
        This middleware "relaxes" the authentication requirement.
    */
    req.isValidTokenRequired = false;
    next();
};

export const tokenExtractor = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: errorMessages[errorNames.invalidAuthHeader] });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        if(token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
                req.user = decoded as JWTSignPayload;

                const pgDBPool = await getPGDBPool();
                const result = await pgDBPool.query(sqlTag.typeAlias('User')`
                    SELECT token_version
                    FROM users
                    WHERE user_id = ${req.user.userId}
                `);

                const tokenVersionWhenUserLoggedIn = req.user.tokenVersion;
                const latestTokenVersionInDB = result.rows[0].token_version;
                if(tokenVersionWhenUserLoggedIn !== latestTokenVersionInDB) {
                    // Token version in db will get changed if user is deleted or restored is changed.
                    const authenticationError = new AuthenticationError(errorMessages[errorNames.tokenInvalid]);
                    next(authenticationError);
                    return;
                }
            }
            catch(error) {
                if(!req.isValidTokenRequired) {
                    next();
                    return;
                }
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
        else {
            next(new AuthenticationError(errorMessages[errorNames.tokenInvalid]));
            return;
        }
    }
    next();
};

export const enforceAuthentication = (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): void => {
    if (!req.user) {
        next(new AuthenticationError());
        return;
    }
    next();
};
  