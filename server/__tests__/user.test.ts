import pgDBPoolUtitlities from '../configs/db';
import { ADMIN, CUSTOMER, SUPERADMIN, User } from '../types';
import { EXPECT_200, EXPECT_201, EXPECT_204, EXPECT_400, EXPECT_403, EXPECT_409, EXPECT_500 } from './testUtils/constants';
import { clearDB, createSomeSeedUsers } from './testUtils/dbUtils';
import { seedAdminUser, seedCustomerUser, seedSuperAdminUser } from './testUtils/seeds';
import { createUser, deleteUser, getUsers, login, updateAvatar, updateUser } from './testUtils/userUtils';

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

    describe('CREATE user by superadmin cases.', () => {
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

    describe('CREATE user by admin users cases.', () => {
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

    describe('CREATE user by customer cases.', () => {
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
        test('Customer can not create a superadmin user.', async () => {
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
        test('customer sign up works.', async () => {
            const newCustomerUser = {
                ...seedCustomerUser,
                username: 'customer2',
                email: 'customer2@gmail.com'
            };
            await createUser(newCustomerUser, EXPECT_201);
        });
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
            await updateUser(user, EXPECT_409, token);
        });

        test('UPDATE fails if email is duplicate.', async () => {
            const user = {
                username: seedAdminUser.username,
                password: seedAdminUser.password,
                email: 'customer1@gmail.com'
            };
            const loginPayload = {
                username: seedAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_409, token);
        });

        describe('Update with partial data works.', () => {
            test('UPDATE succeeds if only email is provided.', async () => {
                const user = {
                    email: 'admin_changed@gmail.com'
                };
                const loginPayload = {
                    username: seedAdminUser.username,
                    password: 'password'
                };
                const token = await login(loginPayload);
                await updateUser(user, EXPECT_200, token);
            });

            test('UPDATE succeeds if only password is provided.', async () => {
                const NEW_PASSWORD = 'new_password';
                const user = {
                    password: NEW_PASSWORD
                };
                const loginPayload = {
                    username: seedAdminUser.username,
                    password: 'password'
                };
                const token = await login(loginPayload);
                await updateUser(user, EXPECT_200, token);
                await login({ ...loginPayload, password: NEW_PASSWORD });
            });
        });

        test('UPDATE avatar', async () => {
            const loginPayload = {
                username: seedAdminUser.username,
                password: seedAdminUser.password
            };
            const token = await login(loginPayload);
            await updateAvatar(EXPECT_200, token);
        });
    });

    describe('DELETE users.', () => {
        describe('DELETE user by superadmin cases.', () => {
            test('superadmin can not delete superadmin.', async () => {
                const loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                const token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                const existingSuperAdminuser = allUsers.find(u => u.userType === SUPERADMIN);
                if(existingSuperAdminuser) {
                    await deleteUser(existingSuperAdminuser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('superadmin can delete admin.', async () => {
                const loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                const token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                const existingAdminUser = allUsers.find(u => u.userType === ADMIN);
                if(existingAdminUser) {
                    await deleteUser(existingAdminUser.userId, EXPECT_204, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('superadmin can delete customer.', async () => {
                const loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                const token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                const existingCustomerUser = allUsers.find(u => u.userType === CUSTOMER);
                if(existingCustomerUser) {
                    await deleteUser(existingCustomerUser.userId, EXPECT_204, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });
        });

        describe('DELETE user by admin cases.', () => {
            test('admin can not delete superadmin.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedAdminUser.username,
                    password: seedAdminUser.password
                };
                token = await login(loginPayload);
                const existingSuperAdminuser = allUsers.find(u => u.userType === SUPERADMIN);
                if(existingSuperAdminuser) {
                    await deleteUser(existingSuperAdminuser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('admin can not delete admin.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedAdminUser.username,
                    password: seedAdminUser.password
                };
                token = await login(loginPayload);
                const existingAdminUser = allUsers.find(u => u.userType === ADMIN);
                if(existingAdminUser) {
                    await deleteUser(existingAdminUser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('admin can delete customer.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedAdminUser.username,
                    password: seedAdminUser.password
                };
                token = await login(loginPayload);
                const existingCustomerUser = allUsers.find(u => u.userType === CUSTOMER);
                if(existingCustomerUser) {
                    await deleteUser(existingCustomerUser.userId, EXPECT_204, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });
        });

        describe('DELETE user by customer cases.', () => {
            test('customer can not delete superadmin.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedCustomerUser.username,
                    password: seedCustomerUser.password
                };
                token = await login(loginPayload);
                const existingSuperAdminuser = allUsers.find(u => u.userType === SUPERADMIN);
                if(existingSuperAdminuser) {
                    await deleteUser(existingSuperAdminuser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('customer can not delete admin.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedCustomerUser.username,
                    password: seedCustomerUser.password
                };
                token = await login(loginPayload);
                const existingAdminUser = allUsers.find(u => u.userType === ADMIN);
                if(existingAdminUser) {
                    await deleteUser(existingAdminUser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('customer can not delete other customer.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);

                const newCustomer = {
                    ...seedCustomerUser,
                    username: 'new_customer',
                    email: 'new_customer@gmail.com'
                };
                await createUser(newCustomer, 201);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedCustomerUser.username,
                    password: seedCustomerUser.password
                };
                token = await login(loginPayload);
                const existingOtherCustomerUser = allUsers.find(u => u.username === newCustomer.username);
                if(existingOtherCustomerUser) {
                    await deleteUser(existingOtherCustomerUser.userId, EXPECT_403, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });

            test('customer can delete own account.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token);
                const allUsers = response.body as User[];
                loginPayload = {
                    username: seedCustomerUser.username,
                    password: seedCustomerUser.password
                };
                token = await login(loginPayload);
                const existingCustomerUser = allUsers.find(u => u.username === seedCustomerUser.username);
                if(existingCustomerUser) {
                    await deleteUser(existingCustomerUser.userId, EXPECT_204, token);
                }
                else {
                    fail('Could not find a user to delete.');
                }
            });
        });
    });

    afterAll(async () => {
        pgDBPoolUtitlities.endConnectionPool();
    });
});