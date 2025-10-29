import type { LoginFormInputs } from '../types/index.ts';
import { AUTH } from './endpoints';
import axios from 'axios';


export const loginApi = async (loginPaylod: LoginFormInputs): Promise<string> => {
    const response = await axios.post(AUTH.login, loginPaylod);
    return response.data.token;
};
