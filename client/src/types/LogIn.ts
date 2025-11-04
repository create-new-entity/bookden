import { ADMIN, CUSTOMER, SUPERADMIN } from '../constants';
import type { UserType } from './Users';

export type LoginFormInputs = {
  username: string;
  password: string;
}

interface SignUp {
  username: string;
  email: string;
  password: string;
}

export interface SignUpFormInputs extends SignUp {
  confirmPassword: string;
}
export interface SignUpPayload extends SignUp {
  userType: UserType;
  isActive: boolean;
}

export type LoggedInUserData = {
  token: string;
  userType: UserType;
};

export const isString = (text: unknown): text is string => {
    const isStringType = typeof text === 'string';
    const isInstanceOfString = text instanceof String;
    return isStringType || isInstanceOfString;
};

export const isUserType = (text: unknown): text is UserType => {
    const textIsString = isString(text);
    return textIsString && (text === CUSTOMER || text === ADMIN || text === SUPERADMIN);
};

export const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};


export const isLoggedInUserData = (object: unknown): object is LoggedInUserData => {
    if (!isRecord(object)) return false;  
    const token = object.token;
    const userType = object.userType;

    const isTokenString = isString(token);
    const isUserTypeCorrect = isUserType(userType);

    return isTokenString && isUserTypeCorrect;
};


