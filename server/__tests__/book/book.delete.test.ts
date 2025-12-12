

import { endConnectionPool, initPGDBPool } from '../../configs';
import { PaginatedDataList } from '../../types';
import { Book } from '../../types/Book';
import {
    clearDB, createSomeSeeBooks, createSomeSeedUsers,
    getBooks, EXPECT_200, getBook,
    EXPECT_403, deleteBook, login,
    customerUsersSeedData, seedSuperAdminUser, adminUsersSeedData
} from '../testUtils';

const TWENTY_SECONDS = 20000;
jest.setTimeout(TWENTY_SECONDS);


describe('DELETE book related tests', () => {
    let response;

    beforeAll(async () => {
        await initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
        await createSomeSeeBooks();
    });

    describe('DELETE book related tests', () => {
        test('DELETE book: Customer user cannot delete book', async () => {
            response = await getBooks(EXPECT_200);
            const { data: books } = response.body as PaginatedDataList<Book>;
            const book = books[0];

            const customerUser = customerUsersSeedData[0];
            const token = await login({ username: customerUser.username, password: customerUser.password });

            response = await deleteBook(book.bookId, EXPECT_403, token);
            expect(response.status).toBe(EXPECT_403);
        });

        test('DELETE book: Super admin or admin user can delete book', async () => {
            response = await getBooks(EXPECT_200);
            const { data: books } = response.body as PaginatedDataList<Book>;

            const book1 = books[0];
            const superAdminUser = seedSuperAdminUser;
            const token1 = await login({ username: superAdminUser.username, password: superAdminUser.password });
            response = await deleteBook(book1.bookId, EXPECT_200, token1);
            expect(response.status).toBe(EXPECT_200);


            const book2 = books[1];
            const adminUser = adminUsersSeedData[0];
            const token2 = await login({ username: adminUser.username, password: adminUser.password });
            response = await deleteBook(book2.bookId, EXPECT_200, token2);
            expect(response.status).toBe(EXPECT_200);

            response = await getBook(book2.bookId, EXPECT_200, token2);
            expect(response.body.deletedAt).not.toBeNull();
        });
    });

    afterAll(async () => {
        await endConnectionPool();
    });
});