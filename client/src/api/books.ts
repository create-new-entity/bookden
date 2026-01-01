import axios, { type AxiosRequestConfig } from 'axios';

import { bookUrl } from './endpoints';
import type { PaginatedDataList, Book, BooksPriceRangeMeta } from '../types';
import type { BookSearchParams } from '../validations';
import { removeEmptyValues } from '../utility';


export const getTags = async () => {
    const response = await axios.get(`${bookUrl}/tags`);
    return response.data;
};

export async function getBooksFiltersMeta(): Promise<BooksPriceRangeMeta> {
    const response = await axios.get(`${bookUrl}/filters/meta`);
    return response.data;
};


export const getBooksList = async (params: BookSearchParams, token?: string): Promise<PaginatedDataList<Book>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const cleanedParams = removeEmptyValues(params);
    const response = await axios.get(bookUrl, { params: cleanedParams, ...requestConfig });
    return response.data;
};

export const getBookCover = async (bookId: number) => {
    const requestConfig: AxiosRequestConfig = {
        responseType: 'blob'
    };
    const response = await axios.get(`${bookUrl}/${bookId}/cover`, requestConfig);
    return response.data;
};

export const deleteBook = async (token: string, bookId: number) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.delete(`${bookUrl}/${bookId}`, requestConfig);
};