import { ADMIN, CUSTOMER, NewUserPayload, SUPERADMIN } from '../../types';

import allAdminUsersSeedData from './../../seed/seedData/admins_seed_data.json';
import allCustomerUsersSeedData from './../../seed/seedData/customers_seed_data.json';


export const seedSuperAdminUser = {
    username: 'superadmin',
    password: 'password',
    email: 'superadmin@gmail.com',
    userType: SUPERADMIN
};

export const seedAdminUser = {
    username: 'admin1',
    password: 'password',
    email: 'admin1@gmail.com',
    userType: ADMIN
};

export const seedCustomerUser = {
    username: 'customer1',
    password: 'password',
    email: 'customer1@gmail.com',
    userType: CUSTOMER
};

const MAX_USERS_PER_TYPE_FOR_TESTING = 20;

export const adminUsersSeedData = allAdminUsersSeedData.slice(0, MAX_USERS_PER_TYPE_FOR_TESTING).map(user => ({ ...user, password: 'password' })) as NewUserPayload[];
export const customerUsersSeedData = allCustomerUsersSeedData.slice(0, MAX_USERS_PER_TYPE_FOR_TESTING).map(user => ({ ...user, password: 'password' })) as NewUserPayload[];

export const allUsersSeedData = [...adminUsersSeedData, ...customerUsersSeedData];