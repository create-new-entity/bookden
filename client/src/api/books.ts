import axios, { type AxiosRequestConfig } from 'axios';

import { bookUrl } from './endpoints';
import type { PaginatedDataList, Book, BooksPriceRangeMeta } from '../types';
import { type BookSearchParams, type CreateUpdateBookData } from '../validations';
import { removeEmptyValues } from '../utility';

export const getBook = async (bookId: number, token?: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${bookUrl}/${bookId}`, requestConfig);
    return response.data;
};

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

export const updateBookCover = async (bookId: number, coverImage: File, token: string) => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);

    const requestConfig: AxiosRequestConfig = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };

    const response = await axios.put(
        `${bookUrl}/${bookId}/cover`,
        formData,
        requestConfig
    );

    return response.data;
};

export const deleteBookCover = async (bookId: number, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.delete(`${bookUrl}/${bookId}/cover`, requestConfig);
};

export const deleteBook = async (bookId: number, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    await axios.delete(`${bookUrl}/${bookId}`, requestConfig);
};

export const updateBook = async (bookId: number, data: CreateUpdateBookData, token: string) => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    // Note to future self: consider using put instead of patch...I mean sending the entire book object anyway so...
    const response = await axios.patch(`${bookUrl}/${bookId}`, data, requestConfig);
    return response.data;
};


type AddBookArgs = {
    data: CreateUpdateBookData;
    coverImage: File;
};

export const addBook = async (
    args: AddBookArgs,
    token: string
) => {
    /*  
        Note to future self:

        Questions:
        1. Why use 'FormData'?
        2. Why the looping and appending?
        3. Why not set content type in request config?

        Answers:
        https://chatgpt.com/share/6965f93e-41e0-8012-b324-2aea2508910b
    */

    const { data, coverImage } = args;

    const formData = new FormData();

    // Serialize domain data → multipart fields
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });


    formData.append('payload', JSON.stringify(data));

    // It should be 'coverImage' because in bookRoutes.ts, we have uploadImage.single('coverImage')
    formData.append('coverImage', coverImage);



    const requestConfig: AxiosRequestConfig = {
        headers: {
            authorization: `Bearer ${token}`
        }
    };
    
    const response = await axios.post(bookUrl, formData, requestConfig);

    return response.data;
};