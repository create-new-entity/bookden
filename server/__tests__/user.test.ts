    
import {
    EXPECT_200, EXPECT_201, EXPECT_204, EXPECT_400, EXPECT_403, EXPECT_409,
    adminUsersSeedData,
    clearDB, createSomeSeedUsers, createUser, customerUsersSeedData, deleteUser, getUsers, login, seedAdminUser,
    seedCustomerUser, seedSuperAdminUser, updateAvatar, updateUser
} from './testUtils';
import { User } from '../types';
import { endConnectionPool, initPGDBPool } from '../configs';

describe('User accounts related tests', () => {

    beforeAll(async () => {
        await initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
        console.log('test users created');
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
            const existingAdminUser = adminUsersSeedData[0];

            const newAdminUser = {
                ...existingAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            const loginPayload = {
                username: seedSuperAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await createUser(existingAdminUser, EXPECT_409, token);  // Should be error -> has same username.
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
            const existingAdminUser = adminUsersSeedData[0];
            const loginPayload = {
                username: existingAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newAdminUser = {
                ...existingAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            await createUser(newAdminUser, EXPECT_403, token);
        });
        test('admins can not create customer users.', async () => {
            const existingAdminUser = adminUsersSeedData[0];
            const existingCustomerUser = customerUsersSeedData[0];
            const loginPayload = {
                username: existingAdminUser.username,
                password: 'password'
            };
            const newCustomerUser = {
                ...existingCustomerUser,
                username: 'customer2',
                email: 'customer2@gmail.com'
            };
            const token = await login(loginPayload);
            await createUser(newCustomerUser, EXPECT_403, token);
        });
    });

    describe('CREATE user by customer cases.', () => {
        test('customer can not create an admin user.', async () => {
            const existingCustomerUser = customerUsersSeedData[0];
            const existingAdminUser = adminUsersSeedData[0];

            const loginPayload = {
                username: existingCustomerUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            const newAdminUser = {
                ...existingAdminUser,
                username: 'admin2',
                email: 'admin2@gmail.com'
            };
            await createUser(newAdminUser, EXPECT_403, token);
        });
        test('Customer can not create a superadmin user.', async () => {
            const existingCustomerUser = customerUsersSeedData[0];
            const loginPayload = {
                username: existingCustomerUser.username,
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
            const existingCustomerUser = customerUsersSeedData[0];
            const newCustomerUser = {
                ...existingCustomerUser,
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
            const existingAdminUser = adminUsersSeedData[0];
            const loginPayload = {
                username: existingAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_200, token);
        });

        test('customer user can update own data.', async () => {
            const existingCustomerUser = customerUsersSeedData[0];
            const user = {
                username: 'customer_updated',
                password: 'new_password',
                email: 'randomNewMail@gmail.com'
            };
            const loginPayload = {
                username: existingCustomerUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_200, token);
        });

        test('UPDATE fails if username is duplicate.', async () => {
            const existingAdminUser = adminUsersSeedData[0];
            const user = {
                username: existingAdminUser.username,
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
            const existingAdminUser = adminUsersSeedData[0];
            const existingCustomerUser = customerUsersSeedData[0];
            const user = {
                username: existingAdminUser.username,
                password: 'password',
                email: existingCustomerUser.email
            };
            const loginPayload = {
                username: existingAdminUser.username,
                password: 'password'
            };
            const token = await login(loginPayload);
            await updateUser(user, EXPECT_409, token);
        });

        describe('Update with partial data works.', () => {
            test('UPDATE succeeds if only email is provided.', async () => {
                const existingAdminUser = adminUsersSeedData[0];
                const user = {
                    email: 'admin_changed@gmail.com'
                };
                const loginPayload = {
                    username: existingAdminUser.username,
                    password: 'password'
                };
                const token = await login(loginPayload);
                await updateUser(user, EXPECT_200, token);
            });

            test('UPDATE succeeds if only password is provided.', async () => {
                const existingAdminUser = adminUsersSeedData[0];
                const NEW_PASSWORD = 'new_password';
                const user = {
                    password: NEW_PASSWORD
                };
                const loginPayload = {
                    username: existingAdminUser.username,
                    password: 'password'
                };
                const token = await login(loginPayload);
                await updateUser(user, EXPECT_200, token);
                await login({ ...loginPayload, password: NEW_PASSWORD });
            });
        });

        test('UPDATE avatar', async () => {
            const existingAdminUser = adminUsersSeedData[0];
            const loginPayload = {
                username: existingAdminUser.username,
                password: 'password'
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
                const response = await getUsers(EXPECT_200, token, 'userType=superadmin');
                const superAdminUsers = response.body as User[];
                if(superAdminUsers[0]) {
                    await deleteUser(superAdminUsers[0].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('superadmin can delete admin.', async () => {
                const loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                const token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, 'userType=admin');
                const adminUsers = response.body as User[];
                if(adminUsers[1]) {
                    await deleteUser(adminUsers[1].userId, EXPECT_204, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('superadmin can delete customer.', async () => {
                const loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                const token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, 'userType=customer');
                const customerUsers = response.body as User[];
                if(customerUsers[0]) {
                    await deleteUser(customerUsers[0].userId, EXPECT_204, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
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
                const response = await getUsers(EXPECT_200, token, 'userType=admin');
                const adminUsers = response.body as User[];
                loginPayload = {
                    username: adminUsers[0].username,
                    password: 'password'
                };
                token = await login(loginPayload);
                if(adminUsers[1]) {
                    await deleteUser(adminUsers[1].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('admin can not delete admin.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, 'userType=admin');
                const adminUsers = response.body as User[];
                loginPayload = {
                    username: adminUsers[0].username,
                    password: 'password'  
                };
                token = await login(loginPayload);
                if(adminUsers[1]) {
                    await deleteUser(adminUsers[1].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('admin can delete customer.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                let response = await getUsers(EXPECT_200, token, 'userType=admin');
                const adminUsers = response.body as User[];
                loginPayload = {
                    username: adminUsers[0].username,
                    password: 'password'
                };
                token = await login(loginPayload);
                response = await getUsers(EXPECT_200, token, 'userType=customer');
                const customerUsers = response.body as User[];
                if(customerUsers[0]) {
                    await deleteUser(customerUsers[0].userId, EXPECT_204, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });
        });

        describe('DELETE user by customer cases.', () => {
            test('customer can not delete superadmin.', async () => {
                const existingCustomerUser = customerUsersSeedData[0];
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, 'userType=superadmin');
                const superAdminusers = response.body as User[];
                loginPayload = {
                    username: existingCustomerUser.username,
                    password: existingCustomerUser.password
                };
                token = await login(loginPayload);
                if(superAdminusers[0]) {
                    await deleteUser(superAdminusers[0].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('customer can not delete admin.', async () => {
                const existingCustomerUser = customerUsersSeedData[0];
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, 'userType=admin');
                const adminUsers = response.body as User[];
                loginPayload = {
                    username: existingCustomerUser.username,
                    password: existingCustomerUser.password
                };
                token = await login(loginPayload);
                if(adminUsers[0]) {
                    await deleteUser(adminUsers[0].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('customer can not delete other customer.', async () => {
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                let token = await login(loginPayload);

                const existingCustomerUser = customerUsersSeedData[0];

                const newCustomer = {
                    ...existingCustomerUser,
                    username: 'new_customer',
                    email: 'new_customer@gmail.com'
                };
                await createUser(newCustomer, 201);
                const response = await getUsers(EXPECT_200, token, 'userType=customer');
                const customerUsers = response.body as User[];
                loginPayload = {
                    username: existingCustomerUser.username,
                    password: existingCustomerUser.password
                };
                token = await login(loginPayload);
                if(customerUsers[0]) {
                    await deleteUser(customerUsers[0].userId, EXPECT_403, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });

            test('customer can delete own account.', async () => {
                const existingCustomerUser = customerUsersSeedData[0];
                let loginPayload = {
                    username: seedSuperAdminUser.username,
                    password: seedSuperAdminUser.password
                };
                console.log('loginPayload', loginPayload);
                let token = await login(loginPayload);
                const response = await getUsers(EXPECT_200, token, `search=${existingCustomerUser.username}`);
                const customerUsers = response.body as User[];
                loginPayload = {
                    username: existingCustomerUser.username,
                    password: existingCustomerUser.password
                };
                token = await login(loginPayload);
                if(customerUsers[0] ) {
                    await deleteUser(customerUsers[0].userId, EXPECT_204, token);
                }
                else {
                    throw new Error('Could not find a user to delete.');
                }
            });
        });
    });

    afterAll(async () => {
        await endConnectionPool();
    });
});