import { isObject } from './TypeGuards';


export interface PostgresError extends Error {
    message: string;
    cause: {
        code: string;
        detail: string;
    };
    constraint: string;
    table: string;
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