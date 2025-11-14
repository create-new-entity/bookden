
import axios, { type AxiosRequestConfig } from 'axios';

import { usersUrl } from './endpoints';
import type { UpdateUserPayload } from '../types/UpdateUser';

export const updateProfile = (newUserData: UpdateUserPayload, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    return axios.patch(usersUrl, newUserData, requestConfig);
};