


import { z } from 'zod';

export const BookTypeAlias = z.object({
    book_id: z.number(),
    title: z.string(),
    synopsis: z.string(),
    authors: z.array(z.string()),
    isbn: z.string(),
    price: z.number(),
    year_published: z.string(),
    language: z.string(),
    pages: z.number(),

    deleted_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    created_at: z.string()
});

