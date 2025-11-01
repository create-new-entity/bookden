import type { LoginFormInputs, SignUpPayload } from '../types/index.ts';
import { AUTH } from './endpoints';
import axios, { type AxiosResponse } from 'axios';


export const loginApi = async (loginPaylod: LoginFormInputs): Promise<string> => {
    const response = await axios.post(AUTH.logIn, loginPaylod);
    return response.data.token;
};

export const signUpApi = async (signUpPayload: SignUpPayload): Promise<AxiosResponse> => {
    return axios.post(AUTH.signUp, signUpPayload);
};
