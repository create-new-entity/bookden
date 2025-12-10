import { endConnectionPool, initPGDBPool } from '../../configs';
import { BOOKS_PAGINATION_LIMIT } from '../../constants';
import { PaginatedDataList } from '../../types';
import { Book } from '../../types/Book';
import {
    clearDB, createSomeSeeBooks, createSomeSeedUsers,
    getBooks, EXPECT_200, getBook,
    EXPECT_403, deleteBook, login,
    customerUsersSeedData, seedSuperAdminUser, adminUsersSeedData } from '../testUtils';

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
        await createSomeSeeBooks();
    });


    describe('Get books related tests', () => {
        test('GET books without authentication', async () => {
            response = await getBooks(EXPECT_200);
            const { data: books } = response.body as PaginatedDataList<Book>;

            expect(books.length).toBeLessThanOrEqual(BOOKS_PAGINATION_LIMIT);
            
            response = await getBook(books[0].bookId, EXPECT_200);
            const book = response.body as Book;

            expect(book.bookId).toBe(books[0].bookId);
            expect(book.title).toBe(books[0].title);
            expect(book.authors).toStrictEqual(books[0].authors);
            expect(book.isbn).toBe(books[0].isbn);
            expect(book.price).toBe(books[0].price);
            expect(book.yearPublished).toBe(books[0].yearPublished);
            expect(book.language).toBe(books[0].language);
        });

        test('GET books using filters "search=man"', async () => {
            const expectedListOfTitles = [
                'Blind Willow, Sleeping Woman Stories',
                'Beartown A Novel',
                'Anxious People A Novel',
                'Anansi Boys',
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'American Gods A Novel',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'A Portrait of the Artist as a Young Man',
                'A Man Called Ove A Novel',
                'A Gentleman in Moscow A Novel'
            ];
            response = await getBooks(EXPECT_200, undefined, 'search=man');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortOrder=asc"', async () => {
            const expectedListOfTitles = [
                'Blind Willow, Sleeping Woman Stories',
                'Beartown A Novel',
                'Anxious People A Novel',
                'Anansi Boys',
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'American Gods A Novel',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'A Portrait of the Artist as a Young Man',
                'A Man Called Ove A Novel',
                'A Gentleman in Moscow A Novel'
            ].reverse(); // reverse the list to test the sort order
            response = await getBooks(EXPECT_200, undefined, 'search=man&sortOrder=asc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=year_published" "sortOrder=desc"', async () => {
            const expectedListOfTitles = [
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'American Gods A Novel',
                'Anxious People A Novel',
                'A Gentleman in Moscow A Novel',
                'Beartown A Novel',
                'A Man Called Ove A Novel',
                'Anansi Boys',
                'Blind Willow, Sleeping Woman Stories', 
                'A Portrait of the Artist as a Young Man',
                'An Island Summer A standalone small-town romance with gripping twists and turns'
            ];

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=yearPublished&sortOrder=desc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=year_published" "sortOrder=asc"', async () => {
            const expectedListOfTitles = [
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'American Gods A Novel',
                'Anxious People A Novel',
                'A Gentleman in Moscow A Novel',
                'Beartown A Novel',
                'A Man Called Ove A Novel',
                'Anansi Boys',
                'Blind Willow, Sleeping Woman Stories', 
                'A Portrait of the Artist as a Young Man',
                'An Island Summer A standalone small-town romance with gripping twists and turns'
            ].reverse();

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=yearPublished&sortOrder=asc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=price" "sortOrder=asc"', async () => {
            const expectedListOfTitles = [
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'Anansi Boys',
                'A Portrait of the Artist as a Young Man',
                'Blind Willow, Sleeping Woman Stories',
                'Anxious People A Novel',
                'Beartown A Novel',
                'A Man Called Ove A Novel',
                'American Gods A Novel',
                'A Gentleman in Moscow A Novel'
            ];

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=price&sortOrder=asc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=price" "sortOrder=desc"', async () => {
            const expectedListOfTitles = [
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'Anansi Boys',
                'A Portrait of the Artist as a Young Man',
                'Blind Willow, Sleeping Woman Stories',
                'Anxious People A Novel',
                'Beartown A Novel',
                'A Man Called Ove A Novel',
                'American Gods A Novel',
                'A Gentleman in Moscow A Novel'
            ].reverse();

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=price&sortOrder=desc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=created_at" "sortOrder=DESC"', async () => {
            const expectedListOfTitles = [
                'Blind Willow, Sleeping Woman Stories',
                'Beartown A Novel',
                'Anxious People A Novel',
                'Anansi Boys',
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'American Gods A Novel',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'A Portrait of the Artist as a Young Man',
                'A Man Called Ove A Novel',
                'A Gentleman in Moscow A Novel',
            ];

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=createdAt&sortOrder=desc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

        test('GET books using filters "search=man" "sortBy=created_at" "sortOrder=ASC"', async () => {
            const expectedListOfTitles = [
                'A Gentleman in Moscow A Novel',
                'A Man Called Ove A Novel',
                'A Portrait of the Artist as a Young Man',
                'All Glory Bulletin (Pkg 100) Palm Sunday',
                'American Gods A Novel',                    
                'An Island Summer A standalone small-town romance with gripping twists and turns',
                'Anansi Boys',      
                'Anxious People A Novel',
                'Beartown A Novel',
                'Blind Willow, Sleeping Woman Stories',
            ];

            response = await getBooks(EXPECT_200, undefined, 'search=man&sortBy=createdAt&sortOrder=asc');
            const { data: books } = response.body as PaginatedDataList<Book>;
            const receivedListOfTitles = books.map(b => b.title);
            console.log(receivedListOfTitles);

            expect(receivedListOfTitles).toStrictEqual(expectedListOfTitles);
        });

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