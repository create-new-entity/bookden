import axios, { type AxiosRequestConfig } from 'axios';
import { usersUrl } from './endpoints';
import type { User } from '../types';
import { removeEmptyValues } from '../utility';

type GetUsersListParams = {
    search: string;
    page: number;
    sortBy: string;
    sortOrder: string;
    userType: string;
};

export const getUsersList = async (params: GetUsersListParams, token: string): Promise<User[]> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(usersUrl, { params: removeEmptyValues(params), ...requestConfig });
    return response.data;
};