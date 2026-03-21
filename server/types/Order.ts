import { z } from 'zod';

import { CreateOrderRequestSchema, GetOrderRequestSchema, GetOrdersQueryParamsSchema } from '../validation/order';
import { UserTypes } from './User';


export type CreateOrderRequestBody = z.infer<typeof CreateOrderRequestSchema>;

export type OrdersQueryOptions = {
    userId: number;
    userType: UserTypes;
    page: number;
    limit: number;
    sortBy: 'createdAt' | 'totalPrice';
    sortOrder: 'asc' | 'desc';
};


export type OrdersQueryParams = z.infer<typeof GetOrdersQueryParamsSchema>;
export type OrderRequestParams = z.infer<typeof GetOrderRequestSchema>;