import { ADMIN, Book, CUSTOMER, NewUserPayload, SUPERADMIN } from '../../types';
import * as R from 'ramda';

import allAdminUsersSeedData from './../../seed/seedData/admins_seed_data.json';
import allCustomerUsersSeedData from './../../seed/seedData/customers_seed_data.json';
import allBooksSeedData from './../../seed/seedData/books_seed_data.json';


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


const extractYear = (raw: string | undefined): number => {
    const DEFAULT_YEAR = 2000;
  
    if (!raw || typeof raw !== 'string') {
        return DEFAULT_YEAR;
    }
  
    const match = raw.match(/\b(19|20)\d{2}\b/);
    if (match) {
        return Number(match[0]);
    }
  
    return DEFAULT_YEAR;
};

const sortedSeedBookData = allBooksSeedData.sort((a, b) => {
    return a.title.localeCompare(b.title);
});
    
const allProcessedSeedBookData: Book[] = sortedSeedBookData.map(book => {
    const processedBook = R.pick(['title', 'synopsis', 'authors', 'isbn', 'msrp', 'date_published', 'language', 'pages', 'subjects'], book);
    const newBook = { ...processedBook } as Book & { tags: string[] };
    newBook.yearPublished = extractYear(book.date_published);
    newBook.tags = book.subjects?.map(subject => subject.trim().toLowerCase()) || [];
    if(book.msrp && !isNaN(book.msrp) && book.msrp > 0) {
        newBook.price = Number(book.msrp);
    } else {
        newBook.price = 100;
    }
    return newBook;
}) as Book[];

export const booksSeedData = allProcessedSeedBookData.slice(0, 90) as Book[];

