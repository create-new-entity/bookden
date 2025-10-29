import snakecaseKeys from 'snakecase-keys';
import { isRecord, SnakeCaseDeepObject } from '../types';
import { errorMessages, errorNames } from '../middlewares';

export const convertToSnakeCaseDeep = <T extends object>(obj: T): SnakeCaseDeepObject<T> => {
    if(isRecord(obj) === true) {
        return snakecaseKeys(obj, { deep: true }) as SnakeCaseDeepObject<T>;
    }
    const internalServerError = new Error(errorMessages[errorNames.internalServerError]);
    internalServerError.name = errorNames.internalServerError;
    throw internalServerError;
};
