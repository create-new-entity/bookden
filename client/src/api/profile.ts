
import axios, { type AxiosRequestConfig } from 'axios';

import { usersUrl } from './endpoints';
import type { UpdateUserFormData } from '../validations';
import type { LoggedInUserData } from '../types';

export const updateProfile = (newUserData: UpdateUserFormData, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return axios.patch(usersUrl, newUserData, requestConfig);
};

export const getMe = async (token: string): Promise<Omit<LoggedInUserData, 'token'>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${usersUrl}/me`, requestConfig);
    return response.data;
};
