import apiSupertest from 'supertest';
import { seedAdminUser, seedCustomerUser, seedSuperAdminUser } from './seeds';
import app from '../../app';
import { testBaseUrl } from '../../routes/testRoutes';
import { getPGDBPool, sqlTag } from '../../configs';


export const clearDB = async () => {
    const pgDBpool = await getPGDBPool();

    await pgDBpool.query(sqlTag.typeAlias('User')`
        DELETE FROM users;
    `);
    
    await pgDBpool.query(sqlTag.typeAlias('User')`
        DELETE FROM avatars;
    `);
};

export const createSomeSeedUsers = async () => {
    await apiSupertest(app)
        .post(`${testBaseUrl}/users`)
        .send(seedSuperAdminUser)
        .expect(201);

    await apiSupertest(app)
        .post(`${testBaseUrl}/users`)
        .send(seedAdminUser)
        .expect(201);
    
    await apiSupertest(app)
        .post(`${testBaseUrl}/users`)
        .send(seedCustomerUser)
        .expect(201);
};