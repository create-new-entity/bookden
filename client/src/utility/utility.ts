import * as R from 'ramda';

const isValidValue = (v: unknown) => !R.isEmpty(v);

export const removeEmptyValues = <T extends Record<string, unknown>>(obj: T): T => {
    // https://ramdajs.com/docs/#filter
    return R.filter(isValidValue, obj);
};