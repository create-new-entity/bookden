import app from '../app';
import apiSupertest from 'supertest';
import pgDBPoolUtitlities from '../configs/db';
import { clearDB, createSomeSeedUsers } from './testUtils/dbUtils';
import { seedSuperAdminUser } from './testUtils/seeds';
import { loginBaseUrl, userBaseUrl } from '../routes';


describe('User accounts related tests', () => {

    let response;

    beforeAll(async () => {
        await pgDBPoolUtitlities.initPGDBPool();
        await clearDB();
        await createSomeSeedUsers();
    });

    test('New superadmin user can not be created.', async () => {
        const newSuperAdminUser = {
            ...seedSuperAdminUser,
            username: 'superadmin2'
        };
        const loginPayload = {
            username: seedSuperAdminUser.username,
            password: 'password'
        };
        response = await apiSupertest(app)
            .post(loginBaseUrl)
            .send(loginPayload)
            .expect(200);
        const token = response.body.token;
        await apiSupertest(app)
            .post(userBaseUrl)
            .set({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
            .send(newSuperAdminUser)
            .expect(403);
    });

    afterAll(async () => {
        pgDBPoolUtitlities.endConnectionPool();
    });
});