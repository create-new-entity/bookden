import axios, { type AxiosResponse } from 'axios';

import type { LoggedInUserData, LoginFormInputs, SignUpPayload } from '../types';
import { AUTH } from './endpoints';

export const loginApi = async (loginPaylod: LoginFormInputs): Promise<LoggedInUserData> => {
    const response = await axios.post(AUTH.logIn, loginPaylod);
    return response.data;
};

export const signUpApi = async (signUpPayload: SignUpPayload): Promise<AxiosResponse> => {
    return axios.post(AUTH.signUp, signUpPayload);
};
