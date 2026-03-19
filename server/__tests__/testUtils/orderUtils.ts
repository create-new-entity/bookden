import apiSupertest from 'supertest';

import app from '../../app';
import { orderBaseUrl } from '../../routes/orderRoutes';
import { CreateOrderRequestBody } from '../../types';
import { seedSuperAdminUser } from './seeds';
import { getUsers, login } from './userUtils';
import { EXPECT_200 } from './constants';
import { getBooksAdmin } from './bookUtils';


export const getExistingBookIds = async () => {
    const superAdminUser = seedSuperAdminUser;
    const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

    const { body } = await getBooksAdmin(EXPECT_200, superAdminToken);
    return [body.data[0].bookId, body.data[1].bookId, body.data[2].bookId];
};

export const getExistingCustomerUserId = async () => {
    const superAdminUser = seedSuperAdminUser;
    const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

    const { body } = await getUsers(EXPECT_200, superAdminToken, 'userType=customer');
    return body.data[0];
};

export const createOrder = async (expectedCode: number, token: string, order: CreateOrderRequestBody) => {
    return await apiSupertest(app)
        .post(orderBaseUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect(expectedCode);
};

export const getOrders = async (expectedCode: number, token: string) => {
    return await apiSupertest(app)
        .get(orderBaseUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(expectedCode);
};