import snakecaseKeys from 'snakecase-keys';
import { isRecord, SnakeCaseDeepObject } from '../types';
import { AppError } from '../errors/AppError';
import { errorMessages, errorNames } from '../errors/errorMessages';

export const convertToSnakeCaseDeep = <T extends object>(obj: T): SnakeCaseDeepObject<T> => {
    if(isRecord(obj) === true) {
        return snakecaseKeys(obj, { deep: true }) as SnakeCaseDeepObject<T>;
    }
    const internalServerError = new AppError(errorMessages[errorNames.internalServerError], 500, false);
    throw internalServerError;
};
