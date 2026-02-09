import axios, { type AxiosRequestConfig } from 'axios';

import { usersUrl } from './endpoints';
import type { PaginatedDataList, User } from '../types';
import { removeEmptyValues } from '../utility';
import type { CreateAdminUserData } from '../validations';
import { ADMIN } from '../constants';

type GetUsersListParams = {
    search: string;
    page: number;
    sortBy: string;
    sortOrder: string;
    userType: string;
};

export const getUsersList = async (params: GetUsersListParams, token: string): Promise<PaginatedDataList<User>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(usersUrl, { params: removeEmptyValues(params), ...requestConfig });
    return response.data;
};


export const getUser = async (userId: number, token: string): Promise<User> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${usersUrl}/${userId}`, requestConfig);
    return response.data;
};

export const deleteUser = async (token: string, userId: number) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.delete(`${usersUrl}/${userId}`, requestConfig);
};

export const createAdminUser = async (createAdminUserData: CreateAdminUserData, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.post(`${usersUrl}`, { ...createAdminUserData, userType: ADMIN }, requestConfig);
};

export const restoreUser = async (token: string, userId: number) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.post(`${usersUrl}/${userId}/restore`, null, requestConfig);
};

