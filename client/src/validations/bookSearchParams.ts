
import { z } from 'zod';

import {
    BOOKS_SORT_BY_OPTIONS, DESC, SORT_ORDER_OPTIONS, TITLE
} from '../constants';


export const BookSearchParamsSchema = z.object({
    search: z.string().default(''),
    page: z.coerce.number().int().positive().default(1),
    sortBy: z.enum(BOOKS_SORT_BY_OPTIONS).default(TITLE),
    sortOrder: z.enum(SORT_ORDER_OPTIONS).default(DESC),
    tags: z.string().optional().default('')
});

export type BookSearchParams = z.infer<typeof BookSearchParamsSchema>;
