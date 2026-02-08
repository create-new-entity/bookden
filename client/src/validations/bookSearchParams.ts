
import { z } from 'zod';

import {
    BOOKS_SORT_BY_OPTIONS, DESC, SORT_ORDER_OPTIONS, TITLE
} from '../constants';


export const BookSearchParamsSchema = z.object({
    search: z.string().default(''),
    page: z.coerce.number().int().positive().default(1),
    sortBy: z.enum(BOOKS_SORT_BY_OPTIONS).default(TITLE),
    sortOrder: z.enum(SORT_ORDER_OPTIONS).default(DESC),
    tags: z.string().optional().default(''),

    priceMin: z.coerce.number().int().optional(),
    priceMax: z.coerce.number().int().optional()
});


/*
    Note to future self:
    
    Difference between BookSearchParams and BookSearchParamsWithTagsArray
    is that BookSearchParams has a tags string, while BookSearchParamsWithTagsArray has a tags array.

    It is easier to keep it as string when deep linking in browser url.
    It is easier to keep it as array when filtering and sorting.

    So, we have both.
*/
export type BookSearchParams = z.infer<typeof BookSearchParamsSchema>;
export type BookSearchParamsWithTagsArray = Omit<BookSearchParams, 'tags'> & { tags: string[] };

