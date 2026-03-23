
import { initPGDBPool } from '../../configs';
import {
    adminUsersSeedData,
    clearDB, createDummyCreateOrderRequestBody,
    createSomeSeedBooks, createSomeSeedUsers, customerUsersSeedData,
    EXPECT_200,
    EXPECT_201, EXPECT_401,
    EXPECT_403, login, seedSuperAdminUser
} from '../testUtils';
import { createOrder, getExistingBookIds, getExistingCustomerUserId, getOrders } from '../testUtils/orderUtils';


const TIMEOUT = 10000; // 10 seconds
/*
    Set the default timeout interval (in milliseconds) for all tests and before/after hooks in the test file.
    This only affects the test file from which this function is called.
    The default timeout interval is 5 seconds if this method is not called.
*/
jest.setTimeout(TIMEOUT);

describe.skip('Orders CRUD tests', () => {
    let response;

    beforeAll(async () => {
        await initPGDBPool();
    });

    beforeEach(async () => {
        await clearDB();
        await createSomeSeedUsers();
        await createSomeSeedBooks();
    });

    
    describe('POST order related tests', () => {
        test('Without authentication order can not be created', async () => {
            const bookIds = await getExistingBookIds();
            const dummyCreateOrderRequestBody = createDummyCreateOrderRequestBody(bookIds);
            response = await createOrder(EXPECT_401, 'invalid_token', dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_401);
        });

        test('Admin or Superadmin can not create orders', async () => {
            const adminUser = adminUsersSeedData[0];
            const superAdminUser = seedSuperAdminUser;
            const adminToken = await login({ username: adminUser.username, password: adminUser.password });
            const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });
            
            const bookIds = await getExistingBookIds();
            const dummyCreateOrderRequestBody = createDummyCreateOrderRequestBody(bookIds);

            response = await createOrder(EXPECT_403, adminToken, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_403);
            response = await createOrder(EXPECT_403, superAdminToken, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_403);
        });

        test('Logged in customer user can create orders', async () => {
            
            const bookIds = await getExistingBookIds();

            const customerUser = customerUsersSeedData[0];
            const token = await login({ username: customerUser.username, password: customerUser.password });
            const dummyCreateOrderRequestBody = createDummyCreateOrderRequestBody(bookIds);


            response = await createOrder(EXPECT_201, token, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_201);
        });
    });

    describe('GET order related tests', () => {
        test('Customer user can get their orders', async () => {
            const { userId, username } = await getExistingCustomerUserId();
            
            const bookIds = await getExistingBookIds();
            const customerUserToken = await login({ username, password: 'password' });
            const dummyCreateOrderRequestBody = createDummyCreateOrderRequestBody(bookIds);

            response = await createOrder(EXPECT_201, customerUserToken, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_201);

            const orders = await getOrders(EXPECT_200, customerUserToken);
            expect(orders.status).toBe(EXPECT_200);

            const order = orders.body.data[0];
            const receivedBookIds = order.items.map((item: { bookId: number }) => item.bookId);
            expect(order.orderId).toBe(response.body.orderId);
            expect(order.userId).toBe(userId);
            expect(receivedBookIds).toEqual(bookIds);
        });

        test('Admin or Superadmin can get all orders', async () => {
            const bookIds = await getExistingBookIds();

            const customerUser0 = customerUsersSeedData[0];
            const customerUserToken0 = await login({ username: customerUser0.username, password: customerUser0.password });
            const dummyCreateOrderRequestBody = createDummyCreateOrderRequestBody(bookIds);

            const customerUser1 = customerUsersSeedData[1];
            const customerUserToken1 = await login({ username: customerUser1.username, password: customerUser1.password });

            response = await createOrder(EXPECT_201, customerUserToken0, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_201);

            response = await createOrder(EXPECT_201, customerUserToken1, dummyCreateOrderRequestBody);
            expect(response.status).toBe(EXPECT_201);


            const adminUser = adminUsersSeedData[0];
            const superAdminUser = seedSuperAdminUser;
            const adminToken = await login({ username: adminUser.username, password: adminUser.password });
            const superAdminToken = await login({ username: superAdminUser.username, password: superAdminUser.password });

            const ordersAdmin = await getOrders(EXPECT_200, adminToken);
            const ordersSuperAdmin = await getOrders(EXPECT_200, superAdminToken);

            expect(ordersAdmin.status).toBe(EXPECT_200);
            expect(ordersSuperAdmin.status).toBe(EXPECT_200);

            expect(ordersAdmin.body.data.length).toBe(2);
            expect(ordersSuperAdmin.body.data.length).toBe(2);
        });
    });
});