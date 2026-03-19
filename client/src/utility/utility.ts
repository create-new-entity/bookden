import * as R from 'ramda';
import { format } from 'date-fns';


import { ADMIN, CUSTOMER, SUPERADMIN } from '../constants';
import type { UserType } from '../types';



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

  

export const canEditBook = (userType?: UserType) => {
    return userType === ADMIN || userType === SUPERADMIN;
};

export const canBuyBook = (userType?: UserType) => {
    if(userType) {
        return userType === CUSTOMER;
    }
    return true; // We want to show add to cart button to all users, even if they are not logged in
};


export const getFormattedDate = (date: Date) => {
    return `${format(date, 'dd/MM/yyyy \'at\' HH:mm')}`;
};


export const isTokenExpired = (token: string) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
};

export const roundTo2 = (value: number) => Math.round(value * 100) / 100;
