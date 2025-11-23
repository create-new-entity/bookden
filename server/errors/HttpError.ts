import { AppError } from './AppError';
import { errorMessages, errorNames } from './errorMessages';

export class BadRequestError extends AppError {
    constructor(message = errorMessages[errorNames.badRequest]) {
        super(message, 400);
    }
};
  
export class NotFoundError extends AppError {
    constructor(message = errorMessages[errorNames.resourceNotFound]) {
        super(message, 404);
    }
};

export class UnauthorizedError extends AppError {
    constructor(message = errorMessages[errorNames.unauthorized]) {
        super(message, 403);
    }
}

export class AuthenticationError extends AppError {
    constructor(message = errorMessages[errorNames.loginRequired]) {
        super(message, 401);
    }
}

export class ConflictError extends AppError {
    constructor(message = errorMessages[errorNames.resourceConflict]) {
        super(message, 409);
    }
}

export class UnsupportedMediaTypeError extends AppError {
    constructor(message = errorMessages[errorNames.unsupportedAvatarExtension]) {
        super(message, 409);
    }
}
 