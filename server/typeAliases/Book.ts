


import { z } from 'zod';

export const BookTypeAlias = z.object({
    book_id: z.number(),
    title: z.string(),
    synopsis: z.string().nullable(),
    authors: z.array(z.string()),
    isbn: z.string(),
    price: z.number(),
    year_published: z
        .number()
        .int()
        .gte(1300, { message: 'Year must be at least 1300' })
        .lte(2025, { message: 'Year cannot exceed 2025' }),
    language: z.string(),
    pages: z.number(),

    deleted_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    created_at: z.string()
});

