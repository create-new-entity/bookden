const UNAUTHORIZED = 'Unauthorized' as const;
const USER_NOT_FOUND = 'UserNotFound' as const;
const RESOURCE_NOT_FOUND = 'ResourceNotFound' as const;
const BAD_REQUEST = 'BadRequest' as const;
const LOGIN_REQUIRED = 'LoginRequired' as const;
const INVALID_PASSWORD = 'InvalidPassword' as const;
const TOKEN_EXPIRED = 'TokenExpired' as const;
const TOKEN_INVALID = 'TokenInvalid' as const;
const ENV_VAR_NOT_DEFINED = 'EnvVariableNotDefined' as const;
const USERNAME_NOT_AVAILABLE = 'UsernameNotAvailable' as const;
const EMAIL_NOT_AVAILABLE = 'EmailNotAvailable' as const;
const RESOURCE_CONFLICT = 'ResourceConflict' as const;
const INTERNAL_SERVER_ERROR = 'InternalServerError' as const;
const VALIDATION_FAILED = 'ValidationFailed' as const;

export const errorNames = {
    unauthorized: UNAUTHORIZED,
    userNotFound: USER_NOT_FOUND,
    resourceNotFound: RESOURCE_NOT_FOUND,
    badRequest: BAD_REQUEST,
    loginRequired: LOGIN_REQUIRED,
    invalidPassword: INVALID_PASSWORD,
    tokenExpired: TOKEN_EXPIRED,
    tokenInvalid: TOKEN_INVALID,
    envVarUndefined: ENV_VAR_NOT_DEFINED,
    emailNotAvailable: EMAIL_NOT_AVAILABLE,
    usernameNotAvailable: USERNAME_NOT_AVAILABLE,
    resourceConflict: RESOURCE_CONFLICT,
    internalServerError: INTERNAL_SERVER_ERROR,
    validationFailed: VALIDATION_FAILED
};

export const errorMessages = {
    [UNAUTHORIZED]: 'You are not authorized to perform this action',
    [USER_NOT_FOUND]: 'User not found',
    [RESOURCE_NOT_FOUND]: 'Resource not found',
    [BAD_REQUEST]: 'Bad request',
    [LOGIN_REQUIRED]: 'You must be logged in to perform this action',
    [INVALID_PASSWORD]: 'Invalid password',
    [TOKEN_EXPIRED]: 'Authentication token has expired',
    [TOKEN_INVALID]: 'Authentication token is invalid',
    [ENV_VAR_NOT_DEFINED]: 'Some env variable is not defined',
    [EMAIL_NOT_AVAILABLE]: 'Email is not available',
    [USERNAME_NOT_AVAILABLE]: 'Username is not available',
    [RESOURCE_CONFLICT]: 'Resource conflicts with existing resource ( duplicate and so on )',
    [INTERNAL_SERVER_ERROR]: 'Internal server error',
    [VALIDATION_FAILED]: 'Validation failed'
};