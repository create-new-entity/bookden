import apiSupertest from 'supertest';
import path from 'path';

import { loginBaseUrl, userBaseUrl } from '../../routes';
import app from '../../app';
import { NewUserPayload, UpdateUserPayload } from '../../types';
import { avatarBaseUrl } from '../../routes/avatarRoutes';


export const login = async (loginPayload: { username: string, password: string }): Promise<string> => {
    const response = await apiSupertest(app)
        .post(loginBaseUrl)
        .send(loginPayload)
        .expect(200);
    return response.body.token;
};

export const createUser = async (user: NewUserPayload, expectedCode: number, token?: string) => {
    await apiSupertest(app)
        .post(userBaseUrl)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .send(user)
        .expect(expectedCode);
};

export const updateUser = async (user: UpdateUserPayload, expectedCode: number, token: string) => {
    await apiSupertest(app)
        .patch(userBaseUrl)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .send(user)
        .expect(expectedCode);
};

export const deleteUser = async (userId: number, expectedCode: number, token: string) => {
    await apiSupertest(app)
        .delete(`${userBaseUrl}/${userId}`)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .expect(expectedCode);
};

export const getUsers = async (expectedCode: number, token: string) => {
    return await apiSupertest(app)
        .get(userBaseUrl)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .expect(expectedCode);
};

export const updateAvatar = async (expectedCode: number, token: string) => {
    const filePath = path.resolve(__dirname, '../files/batman1.jpeg');
    return await apiSupertest(app)
        .put(avatarBaseUrl)
        .set({
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .attach('avatar', filePath)
        .expect(expectedCode);
};