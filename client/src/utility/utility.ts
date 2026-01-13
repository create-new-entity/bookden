import * as R from 'ramda';

import { PLACE_HOLDER_BOOK_COVER } from '../constants';



const isValidValue = (v: unknown) => !R.isEmpty(v);

export const removeEmptyValues = <T extends Record<string, unknown>>(obj: T): T => {
    // https://ramdajs.com/docs/#filter
    return R.filter(isValidValue, obj);
};


export const urlToFile = async (
    url: string,
    filename: string,
    mimeType: string
): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
  
    return new File([blob], filename, { type: mimeType });
};

export const resolveRequiredImageFile = async (file: File | null): Promise<File> => {
    if (file) return file;
  
    return urlToFile(
        PLACE_HOLDER_BOOK_COVER,
        'noBookCoverPlaceholder.jpg',
        'image/jpeg'
    );
};
  
  