import { loginBaseUrl, userBaseUrl } from '../../routes';
import apiSupertest from 'supertest';
import app from '../../app';
import { NewUserPayload, UpdateUserPayload } from '../../types';


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
        .put(userBaseUrl)
        .set({
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        })
        .send(user)
        .expect(expectedCode);
};