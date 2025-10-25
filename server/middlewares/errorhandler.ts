import { Request, Response, NextFunction } from 'express';

const USER_NOT_FOUND = 'UserNotFound' as const;
const INVALID_PASSWORD = 'InvalidPassword' as const;
const INTERNAL_SERVER_ERROR = 'InternalServerError' as const;
const UNAUTHORIZED = 'Unauthorized' as const;
const TOKEN_MISSING = 'TokenMissing' as const;
const INVALID_TOKEN = 'InvalidToken' as const;
const FORBIDDEN_ACTION = 'ForbiddenAction' as const;
const VALIDATION_FAILED = 'ValidationFailed' as const;
const TOKEN_EXPIRED = 'TokenExpiredError' as const;

export const errorNames = {
    userNotFound: USER_NOT_FOUND,
    invalidPassword: INVALID_PASSWORD,
    internalServerError: INTERNAL_SERVER_ERROR,
    unauthorized: UNAUTHORIZED,
    tokenMissing: TOKEN_MISSING,
    invalidToken: INVALID_TOKEN,
    forbiddenAction: FORBIDDEN_ACTION,
    validationFailed: VALIDATION_FAILED,
    tokenExpired: TOKEN_EXPIRED
};

export const errorMessages = {
    [USER_NOT_FOUND]: 'User not found.',
    [INVALID_PASSWORD]: 'Invalid password.',
    [INTERNAL_SERVER_ERROR]: 'An internal server error occurred.',
    [UNAUTHORIZED]: 'Access is not authorized.',
    [TOKEN_MISSING]: 'Authentication token is missing.',
    [INVALID_TOKEN]: 'Authentication token is invalid.',
    [FORBIDDEN_ACTION]: 'Forbidden action. You do not have permission to perform this action.',
    [VALIDATION_FAILED]: 'Data validation failed.',
    [TOKEN_EXPIRED]: 'Authentication token has expired.'
};

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const show404 = error.name === errorNames.userNotFound || error.name === errorNames.invalidPassword;
    if (show404) {
        return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal Server Error.' });
};

export default errorHandler;