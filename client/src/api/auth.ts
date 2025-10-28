import type { LogInProps } from '../types.ts/LogIn';
import { AUTH } from './endpoints';
import axios from 'axios';


export const login = async (loginPaylod: LogInProps): Promise<string> => {
    const response = await axios.post(AUTH.login, loginPaylod);
    return response.data.token;
};
