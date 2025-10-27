import { ADMIN, CUSTOMER, SUPERADMIN } from '../../types';


export const seedSuperAdminUser = {
    username: 'superadmin1',
    password: 'password',
    email: 'superadmin1@gmail.com',
    userType: SUPERADMIN,
    isActive: true
};

export const seedAdminUser = {
    username: 'admin1',
    password: 'password',
    email: 'admin1@gmail.com',
    userType: ADMIN,
    isActive: true
};

export const seedCustomerUser = {
    username: 'customer1',
    password: 'password',
    email: 'customer1@gmail.com',
    userType: CUSTOMER,
    isActive: true
};