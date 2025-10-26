import pgDBPoolUtitlities from '../configs/db';
import { EXPECT_200, EXPECT_201, EXPECT_400, EXPECT_403, EXPECT_500 } from './testUtils/constants';
import { clearDB, createSomeSeedUsers } from './testUtils/dbUtils';
import { seedAdminUser, seedCustomerUser, seedSuperAdminUser } from './testUtils/seeds';
import { createUser, login, updateUser } from './testUtils/userUtils';

describe('User accounts related tests', () => {

    beforeAll(async () => {
        await pgDBPoolUtitlities.initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
    });

    test('New superadmin user can not be created.', async () => {
        const newSuperAdminUser = {
            ...seedSuperAdminUser,
            username: 'superadmin2',
            email: 'superadmin2@gmail.com'
        };
        const loginPayload = {
            username: seedSuperAdminUser.username,
            password: 'password'
        };
        const token = await login(loginPayload);
        await createUser(newSuperAdminUser, EXPECT_400, token); // 400 is correct. Because zod validation will throw error.
    });

    describe('payload validation tests.', () => {
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
            await createUser(seedAdminUser, EXPECT_500, token);  // Should be error -> has same username.
            await createUser(newAdminUser, EXPECT_201, token);   // Should be 201 -> different username and email.
        });

        test('email should be valid.', async () => {
            const newAdminUser = {
                ...seedAdminUser,
                username: 'admin2',
                email: 'invalid email'
            };
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await createUser(newAdminUser, EXPECT_400, token);
        });
    });

    describe('superadmin managing admin users.', () => {
        test('superadmin can not create a superadmin user.', async () => {
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newSuperAdminUser = {
                ...seedSuperAdminUser,
                username: 'superadmin2',
                email: 'superadmin2@gmail.com'
            };
            await createUser(newSuperAdminUser, EXPECT_400, token);
        });
        test('superadmin can create admin user.', async () => {
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newAdminUser = {
                ...seedAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            await createUser(newAdminUser, EXPECT_201, token);
        });
        test('superadmin can not create a customer user.', async () => {
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newCustomerUser = {
                ...seedCustomerUser,
                username: 'customer2',
                email: 'customer2@gmail.com'
            };
            await createUser(newCustomerUser, EXPECT_403, token);
        });
    });

    describe('admin users are not allowed to create any users.', () => {
        test('admins can not create admin users.', async () => {
            const loginPayload = {
                username: seedAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newAdminUser = {
                ...seedAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            await createUser(newAdminUser, EXPECT_403, token);
        });
        test('admins can not create customer users.', async () => {
            const loginPayload = {
                username: seedAdminUser.username,
                password: 'password'
            };
            const newCustomerUser = {
                ...seedCustomerUser,
                username: 'customer2',
                email: 'customer2@gmail.com'
            };
            const token = await login(loginPayload);
            await createUser(newCustomerUser, EXPECT_403, token);
        });
    });

    describe('customer users are not allowed to create any users.', () => {
        test('customer can not create an admin user.', async () => {
            const loginPayload = {
                username: seedCustomerUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newAdminUser = {
                ...seedAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            await createUser(newAdminUser, EXPECT_403, token);
        });
        test('customer can not create a superadmin user.', async () => {
            const loginPayload = {
                username: seedCustomerUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newSuperAdminUser = {
                ...seedSuperAdminUser,
                username: 'superadmin2',
                email: 'superadmin2@gmail.com'
            };
            await createUser(newSuperAdminUser, EXPECT_400, token);
        });
    });
    
    test('customer sign up works.', async () => {
        const newCustomerUser = {
            ...seedCustomerUser,
            username: 'customer2',
            email: 'customer2@gmail.com'
        };
        await createUser(newCustomerUser, EXPECT_201);
    });

    describe('UPDATE users.', () => {
        test('superadmin user can update own data.', async () => {
            const user = {
                username: 'superadmin_updated',
                password: seedSuperAdminUser.password,
                email: seedSuperAdminUser.email
            };
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_200, token);
        });

        test('admin user can update own data.', async () => {
            const user = {
                username: 'admin_updated',
                password: 'new_password',
                email: 'randomNewMail@gmail.com'
            };
            const loginPayload = {
                username: seedAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_200, token);
        });

        test('customer user can update own data.', async () => {
            const user = {
                username: 'customer_updated',
                password: 'new_password',
                email: 'randomNewMail@gmail.com'
            };
            const loginPayload = {
                username: seedCustomerUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_200, token);
        });

        test('UPDATE fails if username is duplicate.', async () => {
            const user = {
                username: seedAdminUser.username,
                password: 'new_password',
                email: 'randomNewMail@gmail.com'
            };
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_500, token);
        });
    });

    afterAll(async () => {
        pgDBPoolUtitlities.endConnectionPool();
    });
});