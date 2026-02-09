import apiSupertest from 'supertest';

import { bookBaseUrl } from '../../routes/bookRoutes';
import app from '../../app';
import { requestAsBuffer } from './miscellaneous';
import { CreateBookPayload, UpdateBookPayload } from '../../types';


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

export const createBook = async (expectedCode: number, token: string, book: CreateBookPayload, imagePath: string) => {
    return await apiSupertest(app)
        .post(bookBaseUrl)
        .set('Authorization', `Bearer ${token}`)
        .field('payload', JSON.stringify(book))
        .field('mimeType', 'image/jpeg')
        .attach('coverImage', imagePath)
        .expect(expectedCode);
};

export const updateBook = async (bookId: number, expectedCode: number, token: string, book: UpdateBookPayload) => {
    return await apiSupertest(app)
        .patch(`${bookBaseUrl}/${bookId}`)
        .set({
            'Content-Type': 'application/json',
            ...{ 'Authorization': `Bearer ${token}` }
        })
        .send(book)
        .expect(expectedCode);
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

export const restoreBook = async (bookId: number, expectedCode: number, token: string) => {
    return await apiSupertest(app)
        .put(`${bookBaseUrl}/${bookId}/restore`)
        .set({
            'Content-Type': 'application/json',
            ...{ 'Authorization': `Bearer ${token}` }
        })
        .expect(expectedCode);
};

export const deleteBookCover = async (bookId: number, expectedCode: number, token: string) => {
    return await apiSupertest(app)
        .delete(`${bookBaseUrl}/${bookId}/cover`)
        .set({
            'Content-Type': 'application/json',
            ...{ 'Authorization': `Bearer ${token}` }
        })
        .expect(expectedCode);
};