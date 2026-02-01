import { AppError, ConflictError, errorMessages, errorNames } from '../errors';
import { PostgresError } from '../types';

const UNIQUE_CONSTRAINT_MESSAGES: Record<string, string> = {
    books_title_unique_ci: 'Failed. Book title already exists. This value is already taken.',
    books_isbn_unique: 'Failed. Book ISBN should be unique. This value is already taken.',


    /* 
        When defined like this: username VARCHAR(30) UNIQUE NOT NULL
        Postgres auto-generates constraint/index names.
    */
    users_username_key: 'Username is not available. Please choose a different username.',
    users_email_key: 'Email is not available. Please choose a different email.'
};


export const mapPostgresErrorToAppError = (error: PostgresError): AppError => {
    const { cause: { code }, constraint } = error;

    if (code === '23505') {
        const message =
            constraint && UNIQUE_CONSTRAINT_MESSAGES[constraint]
                ? UNIQUE_CONSTRAINT_MESSAGES[constraint]
                : 'Resource already exists.';

        return new ConflictError(message);
    }

    const errorMessage = errorMessages[errorNames.internalServerError];
    return new AppError(errorMessage, 500);
};

