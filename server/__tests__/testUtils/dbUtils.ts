import apiSupertest from 'supertest';
import pgDBPoolUtitlities from '../../configs/db';
import { seedSuperAdminUser } from './seeds';
import app from '../../app';
import { testBaseUrl } from '../../routes/testRoutes';

const { sql } = pgDBPoolUtitlities.queryVariants;

export const clearDB = async () => {
    await sql`DELETE FROM users;`;
};

export const createSomeSeedUsers = async () => {
    await apiSupertest(app)
        .post(`${testBaseUrl}/users`)
        .send(seedSuperAdminUser)
        .expect(201);
};