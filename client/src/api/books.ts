import axios, { type AxiosRequestConfig } from 'axios';

import { bookUrl } from './endpoints';
import type { PaginatedDataList, Book } from '../types';
import type { GetBooksListParams } from '../validations';
import { removeEmptyValues } from '../utility';


export const getTags = async () => {
    const response = await axios.get(`${bookUrl}/tags`);
    return response.data;
};


export const getBooksList = async (params: GetBooksListParams, token?: string): Promise<PaginatedDataList<Book>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(bookUrl, { params: removeEmptyValues(params), ...requestConfig });
    return response.data;
};