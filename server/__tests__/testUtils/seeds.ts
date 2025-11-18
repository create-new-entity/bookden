import { ADMIN, CUSTOMER, SUPERADMIN } from '../../types';


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