import { z } from 'zod';

export const TotalTypeAlias = z.object({
    total: z.number(),
});

export const PriceRangeTypeAlias = z.object({
    min_price: z.number(),
    max_price: z.number(),
});

