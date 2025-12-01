
import { z } from 'zod';

import {
    ALL,
    CREATED_AT,
    DESC,
    SELECT_USER_TYPE_OPTIONS,
    USERS_SORT_BY_OPTIONS,
    USERS_SORT_ORDER_OPTIONS
} from '../constants';

export const UserSearchParamsSchema = z.object({
    search: z.string().default(''),
    page: z.coerce.number().int().positive().default(1),
    sortBy: z.enum(USERS_SORT_BY_OPTIONS).default(CREATED_AT),
    sortOrder: z.enum(USERS_SORT_ORDER_OPTIONS).default(DESC),
    userType: z.enum(SELECT_USER_TYPE_OPTIONS).default(ALL)
});

export type UserSearchParams = z.infer<typeof UserSearchParamsSchema>;

