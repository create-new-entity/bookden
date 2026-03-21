import fs from 'fs';
import path from 'path';

import { endConnectionPool, initPGDBPool } from '../../configs';
import { PaginatedDataList, Book } from '../../types';
import {
    clearDB, createSomeSeedBooks, createSomeSeedUsers,
    EXPECT_200, getBooksPublic, getBookCoverPublic,
    EXPECT_404, EXPECT_400, seedSuperAdminUser,
    login, updateBookCover, customerUsersSeedData,
    EXPECT_403, deleteBookCover, adminUsersSeedData,
    getBookCoverAdmin
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
            response = await getBooksPublic(EXPECT_200, `search=${bookTitle}`);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            const expectedImage = path.join(__dirname, '..', 'files', 'dummy.jpeg');
            const expectedImageBuffer = fs.readFileSync(expectedImage);
            const notExpectedImage = path.join(__dirname, '..', 'files', 'batman1.jpeg');
            const notExpectedImageBuffer = fs.readFileSync(notExpectedImage);

            const imageBufferResponse = await getBookCoverPublic(book.bookId, EXPECT_200);
            const imageBuffer = imageBufferResponse.body;
            expect(Buffer.compare(imageBuffer, expectedImageBuffer)).toBe(0);
            expect(Buffer.compare(imageBuffer, notExpectedImageBuffer)).not.toBe(0);

            expect(imageBufferResponse.headers['content-type']).toBe('image/jpeg');
            expect(imageBufferResponse.headers['content-disposition']).toBe('inline');

            await getBookCoverPublic(-1, EXPECT_400);
            await getBookCoverPublic(2342323, EXPECT_404);
        });

        test('PUT book cover', async () => {
            const bookTitle = 'Bleak House';
            response = await getBooksPublic(EXPECT_200, `search=${bookTitle}`);
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
            response = await getBooksPublic(EXPECT_200, `search=${bookTitle}`);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            let token = await login({ username: customerUsersSeedData[0].username, password: customerUsersSeedData[0].password });
            await deleteBookCover(book.bookId, EXPECT_403, token); // Customer user cannot delete book cover

            token = await login({ username: seedSuperAdminUser.username, password: seedSuperAdminUser.password });
            await deleteBookCover(book.bookId, EXPECT_200, token); // Super admin can delete book cover
            await getBookCoverAdmin(book.bookId, EXPECT_404, token); // Has been deleted

            bookTitle = '1 Lessons for the 21st Century';
            token = await login({ username: adminUsersSeedData[0].username, password: adminUsersSeedData[0].password });
            await deleteBookCover(book.bookId, EXPECT_200, token); // Admin user can delete book cover
            await getBookCoverAdmin(book.bookId, EXPECT_404, token); // Has been deleted
        });
    });

    afterAll(async () => {
        await endConnectionPool();
    });
});