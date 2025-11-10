

import axios, { type AxiosRequestConfig } from 'axios';

import { avatar } from './endpoints';

export const getAvatar = async (token: string | null): Promise<Blob> => {
    const requestConfig: AxiosRequestConfig = {
        responseType: 'blob', // Get raw binary data
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(avatar, requestConfig);
    return response.data;
};