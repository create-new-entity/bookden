import { Request, Response, NextFunction } from 'express';
import { SlonikError } from 'slonik';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { PostgresError } from '../types/Errors';

const USER_NOT_FOUND = 'UserNotFound' as const;
const INVALID_PASSWORD = 'InvalidPassword' as const;
const INTERNAL_SERVER_ERROR = 'InternalServerError' as const;
const UNAUTHORIZED = 'Unauthorized' as const;
const TOKEN_MISSING = 'TokenMissing' as const;
const INVALID_TOKEN = 'InvalidToken' as const;
const FORBIDDEN_ACTION = 'ForbiddenAction' as const;
const VALIDATION_FAILED = 'ValidationFailed' as const;
const TOKEN_EXPIRED = 'TokenExpiredError' as const;
const USER_NAME_EMAIL_DUPLICATE = 'UserNameOrEmailIsDuplicate' as const;
const USER_NAME_IS_NOT_AVAILABLE = 'UserNameIsNotAvailable' as const;
const EMAIL_IS_NOT_AVAILABLE = 'EmailIsNotAvailable' as const;

export const errorNames = {
    userNotFound: USER_NOT_FOUND,
    invalidPassword: INVALID_PASSWORD,
    internalServerError: INTERNAL_SERVER_ERROR,
    unauthorized: UNAUTHORIZED,
    tokenMissing: TOKEN_MISSING,
    invalidToken: INVALID_TOKEN,
    forbiddenAction: FORBIDDEN_ACTION,
    validationFailed: VALIDATION_FAILED,
    tokenExpired: TOKEN_EXPIRED,
    usernameOrEmailDuplicate: USER_NAME_EMAIL_DUPLICATE,
    userNameIsNotAvailable: USER_NAME_IS_NOT_AVAILABLE,
    emailIsNotAvailable: EMAIL_IS_NOT_AVAILABLE
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
    [TOKEN_EXPIRED]: 'Authentication token has expired.',
    notAllowedToCreateUser: 'Forbidden: You do not have permission to create this type of user.',
    [USER_NAME_EMAIL_DUPLICATE]: 'Username or Email is not available.',
    [USER_NAME_IS_NOT_AVAILABLE]: 'Username is not available.',
    [EMAIL_IS_NOT_AVAILABLE]: 'Email is not available.'
};

export const isDuplicateError = (error: PostgresError): boolean => {
    return error.cause.code === '23505';
};

export const extractDuplicateErrorMessage = (error: PostgresError): string => {
    const msg = error.cause.detail.split('=')[1];
    return msg.replace(/[()]/g, '');
};

const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const send404 = error.name === errorNames.userNotFound || error.name === errorNames.invalidPassword;
    const send401 = error.name === errorNames.unauthorized || error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError;
    const send403 = error.name === errorNames.forbiddenAction;
    const send409 = error.name === errorNames.userNameIsNotAvailable || error.name === errorNames.emailIsNotAvailable;
    const zodError = error instanceof ZodError;
    const slonikError = error instanceof SlonikError;
    
    if(zodError) {
        return res.status(400).json({ message: `${errorMessages[errorNames.validationFailed]} ${error.message}`});
    }
    else if(slonikError) {
        return res.status(400).json({ message: error.message });
    }
    else if (send404) {
        return res.status(404).json({ message: error.message });
    }
    else if(send401) {
        return res.status(401).json({ message: error.message });
    }
    else if(send403) {
        return res.status(403).json({ message: error.message });
    }
    else if(send409) {
        return res.status(409).json({ message: error.message });
    }
    
    return res.status(500).json({ message: errorMessages[errorNames.internalServerError] });
};

export default errorHandler;