import apiSupertest from 'supertest';

import { bookBaseUrl } from '../../routes/bookRoutes';
import app from '../../app';


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