import snakecaseKeys from 'snakecase-keys';
import * as changeCase from 'change-case';

import { isRecord, SnakeCaseDeepObject } from '../types';
import { AppError, errorMessages, errorNames } from '../errors';

export const convertToSnakeCaseDeep = <T extends object>(obj: T): SnakeCaseDeepObject<T> => {
    if(isRecord(obj) === true) {
        return snakecaseKeys(obj, { deep: true }) as SnakeCaseDeepObject<T>;
    }
    const internalServerError = new AppError(errorMessages[errorNames.internalServerError], 500, false);
    throw internalServerError;
};



export const convertStringToSnakeCase = (str: string): string => {
    return changeCase.snakeCase(str);
};


type NumericTimeStamps = {
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
};

export const mapNumericTimeStampsToDate = (timeStamps: NumericTimeStamps) => {
    return {
        createdAt: new Date(timeStamps.createdAt),
        updatedAt: timeStamps.updatedAt ? new Date(timeStamps.updatedAt) : null,
        deletedAt: timeStamps.deletedAt ? new Date(timeStamps.deletedAt) : null
    };
};