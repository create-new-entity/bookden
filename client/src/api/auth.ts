import type { LoggedInUserData, LoginFormInputs, SignUpPayload } from '../types/index.ts';
import { AUTH } from './endpoints';
import axios, { type AxiosResponse } from 'axios';


export const loginApi = async (loginPaylod: LoginFormInputs): Promise<LoggedInUserData> => {
    const response = await axios.post(AUTH.logIn, loginPaylod);
    return response.data;
};

export const signUpApi = async (signUpPayload: SignUpPayload): Promise<AxiosResponse> => {
    return axios.post(AUTH.signUp, signUpPayload);
};
