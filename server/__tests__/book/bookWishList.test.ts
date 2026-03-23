import { endConnectionPool, initPGDBPool } from '../../configs';
import {
    addBookToWishlist, adminUsersSeedData, clearDB,
    createSomeSeedBooks, createSomeSeedUsers,
    customerUsersSeedData, deleteBook, EXPECT_200,
    EXPECT_403, EXPECT_404, getBooksAdmin, getBooksPublic, getWishList, login,
    removeBookFromWishlist,
    seedSuperAdminUser
} from '../testUtils';

const TWENTY_SECONDS = 20000;
jest.setTimeout(TWENTY_SECONDS);


describe.skip('Books Wish List tests', () => {
    let response;

    beforeAll(async () => {
        await initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
        await createSomeSeedBooks();
    });

    test('GET wishlist: Customer user can get his wishlisted books', async () => {
        const customerUser = customerUsersSeedData[0];
        const token = await login({ username: customerUser.username, password: customerUser.password });
        response = await getWishList(EXPECT_200, token);
        expect(response.status).toBe(EXPECT_200);
    });

    test('POST wishlist: Customer user can add a book to his wishlist', async () => {
        const customerUser = customerUsersSeedData[0];
        const token = await login({ username: customerUser.username, password: customerUser.password });
        
        response = await getBooksPublic(EXPECT_200, 'page=1&limit=10');
        expect(response.status).toBe(EXPECT_200);
        const books = response.body.data;
        const book = books[0];
        response = await addBookToWishlist(EXPECT_200, token, book.bookId);
        expect(response.status).toBe(EXPECT_200);

        response = await getWishList(EXPECT_200, token);
        expect(response.status).toBe(EXPECT_200);
        const wishlistedBooks = response.body.data;
        expect(wishlistedBooks.length).toBe(1);
        expect(wishlistedBooks[0].bookId).toBe(book.bookId);
    });

    test('DELETE wishlist: Customer user can remove a book from his wishlist', async () => {
        const customerUser = customerUsersSeedData[0];
        const token = await login({ username: customerUser.username, password: customerUser.password });

        response = await getBooksPublic(EXPECT_200, 'page=1&limit=10');
        expect(response.status).toBe(EXPECT_200);
        const books = response.body.data;
        const book = books[0];

        response = await addBookToWishlist(EXPECT_200, token, book.bookId);
        expect(response.status).toBe(EXPECT_200);

        response = await getWishList(EXPECT_200, token);
        expect(response.status).toBe(EXPECT_200);
        let wishlistedBooks = response.body.data;
        expect(wishlistedBooks.length).toBe(1);
        expect(wishlistedBooks[0].bookId).toBe(book.bookId);
        
        response = await removeBookFromWishlist(EXPECT_200, token, book.bookId);
        expect(response.status).toBe(EXPECT_200);

        response = await getWishList(EXPECT_200, token);
        expect(response.status).toBe(EXPECT_200);
        wishlistedBooks = response.body.data;
        expect(wishlistedBooks.length).toBe(0);
    });
    
    test('Admin or Superadmin can not GET, POST or DELETE wishlist', async () => {
        const adminUser = adminUsersSeedData[0];
        const superAdminUser = seedSuperAdminUser;

        const adminToken = await login({ username: adminUser.username, password: adminUser.password });
        const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

        response = await getWishList(EXPECT_403, adminToken);
        expect(response.status).toBe(EXPECT_403);

        response = await getWishList(EXPECT_403, superAdminToken);
        expect(response.status).toBe(EXPECT_403);

        response = await addBookToWishlist(EXPECT_403, adminToken, 1);
        expect(response.status).toBe(EXPECT_403);

        response = await addBookToWishlist(EXPECT_403, superAdminToken, 1);
        expect(response.status).toBe(EXPECT_403);

        response = await removeBookFromWishlist(EXPECT_403, adminToken, 1);
        expect(response.status).toBe(EXPECT_403);

        response = await removeBookFromWishlist(EXPECT_403, superAdminToken, 1);
        expect(response.status).toBe(EXPECT_403);
    });

    /*
        We soft delete books, not entirely delete them. Intention is to use
        data for analytics features that are yet to come.

        Following tests are to ensure that, "deleted" books can not be added to wishlist or removed from wishlist.
    */

    test('Deleted book can not be added to wishlist', async () => {

        const superAdminUser = seedSuperAdminUser;
        const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

        const books = await getBooksAdmin(EXPECT_200, superAdminToken, 'page=1&limit=10');
        expect(books.status).toBe(EXPECT_200);
        const booksData = books.body.data;
        const book = booksData[0];

        response = await deleteBook(book.bookId, EXPECT_200, superAdminToken);
        expect(response.status).toBe(EXPECT_200);

        const customerUser = customerUsersSeedData[0];
        const customerToken = await login({ username: customerUser.username, password: customerUser.password });
        response = await addBookToWishlist(EXPECT_404, customerToken, book.bookId);
        expect(response.status).toBe(EXPECT_404);
    });

    test('Deleted book can not be removed from wishlist', async () => {
        const superAdminUser = seedSuperAdminUser;
        const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

        const customerUser = customerUsersSeedData[0];
        const customerToken = await login({ username: customerUser.username, password: customerUser.password });

        const books = await getBooksAdmin(EXPECT_200, superAdminToken, 'page=1&limit=10');
        expect(books.status).toBe(EXPECT_200);
        const booksData = books.body.data;
        const book = booksData[0];

        response = await addBookToWishlist(EXPECT_200, customerToken, book.bookId);
        expect(response.status).toBe(EXPECT_200);

        response = await deleteBook(book.bookId, EXPECT_200, superAdminToken);
        expect(response.status).toBe(EXPECT_200);

        response = await removeBookFromWishlist(EXPECT_404, customerToken, book.bookId);
        expect(response.status).toBe(EXPECT_404);
    });
    
    afterAll(async () => {
        await endConnectionPool();
    });
});