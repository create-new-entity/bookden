

export interface PostgresError extends Error {
    message: string;
    cause: {
        code: string;
        detail: string;
    };
    constraint: string;
    table: string;
};

export const isObject = (error: unknown): error is object => {
    return typeof error === 'object' && error !== null;
};

export const isString = (text: unknown): text is string => {
    return (typeof text === 'string') || (text instanceof String);
};

export const isPostgresError = (error: unknown): error is PostgresError => {
    return isObject(error)
    && 'message' in error
    && 'cause' in error
    && isObject(error.cause)
    && 'code' in error.cause
    && 'detail' in error.cause
    && 'constraint' in error
    && 'table' in error;
};