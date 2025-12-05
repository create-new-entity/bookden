

import axios, { type AxiosRequestConfig } from 'axios';

import { avatarUrl, userAvatarUrl } from './endpoints';

export const getUserAvatarBlob = async (token: string | null, userId: number) => {
    const requestConfig: AxiosRequestConfig = {
        responseType: 'blob',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(`${userAvatarUrl}/${userId}`, requestConfig);
    return response.data;
};

export const getAvatar = async (token: string | null): Promise<Blob> => {
    const requestConfig: AxiosRequestConfig = {
        responseType: 'blob', // Get raw binary data
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.get(avatarUrl, requestConfig);
    return response.data;
};

export const deleteAvatar = async (token: string | null): Promise<void> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    await axios.delete(avatarUrl, requestConfig);
};

export const addOrUpdate = async (newAvatar: File, token: string | null): Promise<void> => {
    const formData = new FormData();
    formData.append('avatar', newAvatar);

    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.put(avatarUrl, formData, requestConfig);
};