import { Request, Response, NextFunction } from 'express';

const USER_NOT_FOUND = 'UserNotFound' as const;
const INVALID_PASSWORD = 'InvalidPassword' as const;

export const errorNames = {
    userNotFound: USER_NOT_FOUND,
    invalidPassword: INVALID_PASSWORD
};

export const errorMessages = {
    [USER_NOT_FOUND]: 'User not found.',
    [INVALID_PASSWORD]: 'Invalid password.'
};

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const show404 = error.name === errorNames.userNotFound || error.name === errorNames.invalidPassword;
    if (show404) {
        return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal Server Error.' });
};

export default errorHandler;