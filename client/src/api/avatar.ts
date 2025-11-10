

import axios, { type AxiosRequestConfig } from 'axios';

import { avatarApi } from './endpoints';

export const getAvatar = async (token: string | null): Promise<Blob> => {
    const requestConfig: AxiosRequestConfig = {
        responseType: 'blob', // Get raw binary data
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(avatarApi, requestConfig);
    return response.data;
};

export const deleteAvatar = async (token: string | null): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    await axios.delete(avatarApi, requestConfig);
};

export const addOrUpdate = async (newAvatar: File, token: string | null): Promise<void> => {
    const formData = new FormData();
    formData.append('avatar', newAvatar);

    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.put(avatarApi, formData, requestConfig);
};