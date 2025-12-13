import apiSupertest from 'supertest';

import { bookBaseUrl } from '../../routes/bookRoutes';
import app from '../../app';
import { requestAsBuffer } from './miscellaneous';


export const getBooks = async (expectedCode: number, token?: string, queryParams?: string) => {
    return await apiSupertest(app)
        .get(queryParams ? `${bookBaseUrl}?${queryParams}` : bookBaseUrl)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .expect(expectedCode);
};

export const getBook = async (bookId: number, expectedCode: number, token?: string) => {
    return await apiSupertest(app)
        .get(`${bookBaseUrl}/${bookId}`)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .expect(expectedCode);
};

export const getBookCover = async (bookId: number, expectedCode: number) => {
    return await requestAsBuffer(
        apiSupertest(app)
            .get(`/api/books/${bookId}/cover`)
            .expect(expectedCode)
    );
};


export const updateBookCover = async (bookId: number, expectedCode: number, token: string, imagePath: string) => {
    return await apiSupertest(app)
        .put(`${bookBaseUrl}/${bookId}/cover`)
        .set({
            'Content-Type': 'application/json',
            ...{ 'Authorization': `Bearer ${token}` }
        })
        .field('mimeType', 'image/jpeg')
        .attach('coverImage', imagePath)  // Use this dummy image as cover image for the book.
        .expect(expectedCode);
};

export const deleteBook = async (bookId: number, expectedCode: number, token?: string) => {
    return await apiSupertest(app)
        .delete(`${bookBaseUrl}/${bookId}`)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .expect(expectedCode);
};