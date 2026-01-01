import { z } from 'zod';

export const TotalTypeAlias = z.object({
    total: z.number(),
});

export const PriceRangeTypeAlias = z.object({
    price_min: z.number(),
    price_max: z.number(),
});

