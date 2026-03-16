
import { sql } from 'slonik';

import { sqlTag, getPGDBPool } from '../configs';
import { CreateOrderRequestBody, OrdersQueryOptions } from '../types/Order';
import { errorMessages, errorNames, NotFoundError } from '../errors';
import { convertStringToSnakeCase } from '../utilities';
import { CUSTOMER, UserTypes } from '../types';


const createOrder = async (userId: number, items: CreateOrderRequestBody['items']) => {
    const dbPool = await getPGDBPool();
    const bookIds = items.map(item => item.bookId);

    const booksResult = await dbPool.query(sqlTag.typeAlias('Book')`
        SELECT book_id, price, title
        FROM books
        WHERE book_id = ANY(${sql.array(bookIds, 'int4')})
        AND deleted_at IS NULL
    `);

    if (booksResult.rows.length !== items.length) {
        throw new NotFoundError(errorMessages[errorNames.invalidBookId]);
    }

    const bookMap = new Map(
        booksResult.rows.map(book => [book.book_id, book])
    );

    const totalPrice = items.reduce((acc, item) => {
        const book = bookMap.get(item.bookId);
        return acc + (Number(book?.price || 0) * item.quantity);
    }, 0);

    return await dbPool.transaction(async (trx) => {
        const orderResult = await trx.query(sqlTag.typeAlias('Order')`
            INSERT INTO orders (user_id, total_price)
            VALUES (${userId}, ${totalPrice})
            RETURNING order_id
        `);
        const orderId = orderResult.rows[0].order_id;

        for (const item of items) {
            const book = bookMap.get(item.bookId)!;
            
            /*
                There won't be many orders in the firs place.
                It is portfolio project anyway.
                To keep things simple, I'll use a looped version of query this time.
            */
            // eslint-disable-next-line no-await-in-loop
            await trx.query(sqlTag.typeAlias('Void')`
                INSERT INTO order_items (
                    order_id, book_id, quantity,
                    unit_price_snapshot, title_snapshot
                )
                VALUES (
                    ${orderId}, ${item.bookId}, ${item.quantity},
                    ${book.price}, ${book.title}
                )
            `);
        }

        return orderId;
    });
};

const getOrders = async (options: OrdersQueryOptions) => {
    const dbPool = await getPGDBPool();
    const {
        page, limit, sortBy,
        sortOrder, userType, userId
    } = options;
    
    const snakeCasedSortBy = convertStringToSnakeCase(sortBy);

    const sortOrderFragment = sortOrder === 'asc'
        ? sqlTag.fragment`ASC`
        : sqlTag.fragment`DESC`;

    /*
        sqlTag.identifier(['o', snakeCasedSortBy]) -> o.created_at
        Slonik didn't like direct string interpolation for column names.

        ChatGPT: "Using identifier() prevents SQL injection."
    */
    const sortByFragment = sqlTag.fragment`
        ORDER BY ${sqlTag.identifier(['o', snakeCasedSortBy])} ${sortOrderFragment}
    `;

    /*
        If it is a customer, only his own orders should be returned.
        If it is an admin or superadmin, all orders should be returned.
    */
    const isCustomer = userType === CUSTOMER;
    const authorizationFragment = isCustomer
        ? sqlTag.fragment`AND o.user_id = ${userId}`
        : sqlTag.fragment``;
    
    const result = await dbPool.query(
        sqlTag.typeAlias('OrderWithItems')`
            SELECT 
                o.order_id, o.user_id,
                o.total_price, o.created_at,
                json_agg(
                    json_build_object(
                        'book_id', oi.book_id,
                        'quantity', oi.quantity,
                        'unit_price_snapshot', oi.unit_price_snapshot,
                        'title_snapshot', oi.title_snapshot
                    )
                ) AS items
            FROM orders o
            INNER JOIN order_items oi
                ON oi.order_id = o.order_id
            WHERE 1 = 1
            ${authorizationFragment}
            GROUP BY o.order_id
            ${sortByFragment}
            LIMIT ${limit}
            OFFSET ${(page - 1) * limit}
        `
    );

    const totalResult = await dbPool.one(sqlTag.typeAlias('Total')`
        SELECT
            COUNT(order_id)::int AS total
        FROM orders o
        WHERE 1 = 1
        ${authorizationFragment}
    `);

    const totalOrders = totalResult.total;

    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
        data: result.rows,
        pagination: {
            page,
            limit,
            total: totalOrders,
            totalPages,
            hasNextPage,
            hasPreviousPage
        }
    };

};

const getOrder = async (
    orderId: number,
    userId: number,
    userType: UserTypes
) => {
    const dbPool = await getPGDBPool();

    const isCustomer = userType === CUSTOMER;

    const authorizationFragment = isCustomer
        ? sqlTag.fragment`AND o.user_id = ${userId}`
        : sqlTag.fragment``;

    const result = await dbPool.query(
        sqlTag.typeAlias('OrderWithItems')`
            SELECT
                o.order_id, o.user_id,
                o.total_price, o.created_at,
                json_agg(
                    json_build_object(
                        'book_id', oi.book_id,
                        'quantity', oi.quantity,
                        'unit_price_snapshot', oi.unit_price_snapshot,
                        'title_snapshot', oi.title_snapshot
                    )
                ) AS items
            FROM orders o
            INNER JOIN order_items oi
                ON oi.order_id = o.order_id
            WHERE o.order_id = ${orderId}
            ${authorizationFragment}
            GROUP BY o.order_id
        `
    );

    if (result.rows.length === 0) {
        throw new NotFoundError(errorMessages[errorNames.resourceNotFound]);
    }

    return result.rows[0];
};

export {
    createOrder,
    getOrders,
    getOrder
};