

import { z } from 'zod';

/*
    OrderTypeAlias: Represents the orders table.
    It contains which user made which order and what is the total price of the order.
*/

export const OrderTypeAlias = z.object({
    order_id: z.number(),
    user_id: z.number(),
    total_price: z.coerce.number(),
    created_at: z.string(),
});


/*
    OrderItemTypeAlias: Represents the order_items table.
    It contains which book belongs to which order and
    what was the quantity of it in that order.
    This table also tells what was the unit price of the book at the time of the order.

    A book can be in multiple orders.
    An order can have multiple books.
    All books in an order are unique.
*/

export const OrderItemTypeAlias = z.object({
    order_item_id: z.number(),
    order_id: z.number(),
    book_id: z.number(),
    quantity: z.number(),
    unit_price_snapshot: z.coerce.number(),
    title_snapshot: z.string(),
    created_at: z.string(),
});



/*
    OrderWithItemsTypeAlias: is the combination or the "straightened out" result data
    of the OrderTypeAlias and the OrderItemTypeAlias.

    This is what we send to the client when client requests orders.
*/


export const OrderItemSnapshotTypeAlias = z.object({
    book_id: z.number(),
    quantity: z.number(),
    unit_price_snapshot: z.coerce.number(),
    title_snapshot: z.string(),
});

export const OrderWithItemsTypeAlias = z.object({
    order_id: z.number(),
    user_id: z.number(),
    total_price: z.coerce.number(),
    created_at: z.string(),
    items: z.array(OrderItemSnapshotTypeAlias),
});
