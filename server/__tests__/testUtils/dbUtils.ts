import apiSupertest from 'supertest';
import path from 'path';


import { allUsersSeedData, booksSeedData, seedSuperAdminUser } from './seeds';
import app from '../../app';
import { testBaseUrl } from '../../routes/testRoutes';
import { getPGDBPool, sqlTag } from '../../configs';

export const clearDB = async () => {
    const pgDBpool = await getPGDBPool();

    await pgDBpool.query(sqlTag.typeAlias('User')`
        DELETE FROM users;
    `);
    console.log('Cleared users');


    await pgDBpool.query(sqlTag.typeAlias('User')`
        DELETE FROM avatars;
    `);
    console.log('Cleared avatars');


    await pgDBpool.query(sqlTag.typeAlias('Book')`
        DELETE FROM books;
    `);
    console.log('Cleared books');

    await pgDBpool.query(sqlTag.typeAlias('BookCover')`
        DELETE FROM book_covers;
    `);
    console.log('Cleared book covers');
};

export const createSomeSeedUsers = async () => {
    await apiSupertest(app)
        .post(`${testBaseUrl}/users`)
        .send(seedSuperAdminUser)
        .expect(201);

    for await (const user of allUsersSeedData) {
        await apiSupertest(app)
            .post(`${testBaseUrl}/users`)
            .send({ ...user, password: 'password' })
            .expect(201);
    }
};


const dummyImagePath = path.join(__dirname, '..', 'files', 'dummy.jpeg');
export const createSomeSeedBooks = async () => {
    for (const book of booksSeedData) {
        // eslint-disable-next-line no-await-in-loop
        await apiSupertest(app)
            .post(`${testBaseUrl}/books`)
            .field('payload', JSON.stringify(book))
            .field('mimeType', 'image/jpeg')
            .attach('coverImage', dummyImagePath)  // Use this dummy image as cover image for the book.
            .expect(201);
    };
};

