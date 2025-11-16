
import axios, { type AxiosRequestConfig } from 'axios';

import { usersUrl } from './endpoints';
import type { UpdateUserPayload } from '../types/UpdateUser';
import type { LoggedInUserData } from '../types';

export const updateProfile = (newUserData: UpdateUserPayload, token: string) => {
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