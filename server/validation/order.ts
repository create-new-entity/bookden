
import { z } from 'zod';


export const CreateOrderBookSchema = z.object({
    bookId: z.number().int().positive(),
    quantity: z.number().int().positive()
});

const MINIMUM_ORDER_ITEMS = 1;
const MAXIMUM_ORDER_ITEMS = 50; // Prevents abusive payloads

export const CreateOrderRequestSchema = z.object({
    items: z.array(CreateOrderBookSchema).min(MINIMUM_ORDER_ITEMS).max(MAXIMUM_ORDER_ITEMS)
});



const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_ORDER = 'desc';

export const GetOrdersQueryParamsSchema = z.object({
    page: z.coerce.number().int().positive().default(DEFAULT_PAGE),
    limit: z.coerce.number().int().positive().max(DEFAULT_LIMIT).default(DEFAULT_LIMIT),
    sortBy: z.enum(['createdAt', 'totalPrice']).default(DEFAULT_SORT_BY),
    sortOrder: z.enum(['asc', 'desc']).default(DEFAULT_SORT_ORDER)
});


export const GetOrderRequestSchema = z.object({
    orderId: z.coerce.number().int().positive()
});