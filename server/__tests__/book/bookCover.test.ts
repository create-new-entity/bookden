import fs from 'fs';
import path from 'path';

import { endConnectionPool, initPGDBPool } from '../../configs';
import { PaginatedDataList, Book } from '../../types';
import {
    clearDB, createSomeSeedBooks, createSomeSeedUsers,
    getBooks, EXPECT_200, getBookCover,
    EXPECT_404,
    EXPECT_400,
    seedSuperAdminUser,
    login,
    updateBookCover,
    customerUsersSeedData,
    EXPECT_403,
    deleteBookCover,
    adminUsersSeedData
} from '../testUtils';

const TWENTY_SECONDS = 20000;
jest.setTimeout(TWENTY_SECONDS);


describe('GET Book(s) related tests', () => {
    let response;

    beforeAll(async () => {
        await initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
        await createSomeSeedBooks();
    });


    describe('Book cover related tests', () => {
    
        test('GET book cover', async () => {
            const bookTitle = 'Bleak House';
            response = await getBooks(EXPECT_200, undefined, `search=${bookTitle}`);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            const expectedImage = path.join(__dirname, '..', 'files', 'dummy.jpeg');
            const expectedImageBuffer = fs.readFileSync(expectedImage);
            const notExpectedImage = path.join(__dirname, '..', 'files', 'batman1.jpeg');
            const notExpectedImageBuffer = fs.readFileSync(notExpectedImage);

            const imageBufferResponse = await getBookCover(book.bookId, EXPECT_200);
            const imageBuffer = imageBufferResponse.body;
            expect(Buffer.compare(imageBuffer, expectedImageBuffer)).toBe(0);
            expect(Buffer.compare(imageBuffer, notExpectedImageBuffer)).not.toBe(0);

            expect(imageBufferResponse.headers['content-type']).toBe('image/jpeg');
            expect(imageBufferResponse.headers['content-disposition']).toBe('inline');

            await getBookCover(-1, EXPECT_400);
            await getBookCover(2342323, EXPECT_404);
        });

        test('PUT book cover', async () => {
            const bookTitle = 'Bleak House';
            response = await getBooks(EXPECT_200, undefined, `search=${bookTitle}`);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            const expectedImage = path.join(__dirname, '..', 'files', 'dummy.jpeg');
            
            let token = await login({ username: seedSuperAdminUser.username, password: seedSuperAdminUser.password });
            const updateBookCoverResponse = await updateBookCover(book.bookId, EXPECT_200, token, expectedImage);
            expect(updateBookCoverResponse.status).toBe(EXPECT_200);

            token = await login({ username: customerUsersSeedData[0].username, password: customerUsersSeedData[0].password });
            await updateBookCover(book.bookId, EXPECT_403, token, expectedImage);
        });

        test('DELETE book cover', async () => {
            let bookTitle = 'Bleak House';
            response = await getBooks(EXPECT_200, undefined, `search=${bookTitle}`);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            let token = await login({ username: customerUsersSeedData[0].username, password: customerUsersSeedData[0].password });
            await deleteBookCover(book.bookId, EXPECT_403, token); // Customer user cannot delete book cover

            token = await login({ username: seedSuperAdminUser.username, password: seedSuperAdminUser.password });
            await deleteBookCover(book.bookId, EXPECT_200, token); // Super admin can delete book cover
            await getBookCover(book.bookId, EXPECT_404); // Has been deleted

            bookTitle = '1 Lessons for the 21st Century';
            token = await login({ username: adminUsersSeedData[0].username, password: adminUsersSeedData[0].password });
            await deleteBookCover(book.bookId, EXPECT_200, token); // Admin user can delete book cover
            await getBookCover(book.bookId, EXPECT_404); // Has been deleted
        });
    });

    afterAll(async () => {
        await endConnectionPool();
    });
});