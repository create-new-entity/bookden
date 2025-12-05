import axios, { type AxiosResponse } from 'axios';

import type { LoggedInUserData, LoginFormInputs, SignUpPayload } from '../types';
import { loginUrl, usersUrl } from './endpoints';

export const login = async (loginPayload: LoginFormInputs): Promise<LoggedInUserData> => {
    const response = await axios.post(loginUrl, loginPayload);
    return response.data;
};

export const signUp = async (signUpPayload: SignUpPayload): Promise<AxiosResponse> => {
    return axios.post(usersUrl, signUpPayload);
};
