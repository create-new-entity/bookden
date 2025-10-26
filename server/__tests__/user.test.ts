import app from '../app';
import apiSupertest from 'supertest';
import pgDBPoolUtitlities from '../configs/db';
import { clearDB, createSomeSeedUsers } from './testUtils/dbUtils';
import { seedAdminUser, seedSuperAdminUser } from './testUtils/seeds';
import { userBaseUrl } from '../routes';
import { createUser, login } from './testUtils/userUtils';


describe('User accounts related tests', () => {

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
        const token = await login(loginPayload);
        await apiSupertest(app)
            .post(userBaseUrl)
            .set({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            })
            .send(newSuperAdminUser)
            .expect(403);
    });

    test('username should be unique.', async () => {
        const newAdminUser = {
            ...seedAdminUser,
            username: 'admin2',
            email: 'admin2@gmail.com'
        };
        const loginPayload = {
            username: seedSuperAdminUser.username,
            password: 'password'
        };
        const token = await login(loginPayload);
        await createUser(seedAdminUser, 201, token);
        await createUser(seedAdminUser, 500, token);  // Should be error -> has same username.
        await createUser(newAdminUser, 201, token);   // Should be 201 -> different username and email.
    });

    afterAll(async () => {
        pgDBPoolUtitlities.endConnectionPool();
    });
});