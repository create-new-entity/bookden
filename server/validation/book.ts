import { z } from 'zod';

import { booksSortByOptions, sortOrderOptions } from '../constants';

const CURRENT_YEAR = new Date().getFullYear();
const EARLIEST_YEAR_PUBLISHED = 1200;

export const UpdateBookPayloadSchema = z.object({
    title: z.string().min(1, { message: 'Title must be a non-empty string' }).optional(),
    synopsis: z.string().optional(),
    tags: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    isbn: z.string().min(1, { message: 'ISBN must be a non-empty string' }).optional(),
    price: z.number().min(0, { message: 'Price must be a non-negative number' }).optional(),
    yearPublished: z.number()
        .int()
        .gte(EARLIEST_YEAR_PUBLISHED, { message: `Year must be at least ${EARLIEST_YEAR_PUBLISHED}` })
        .lte(CURRENT_YEAR, { message: `Year must be at most ${CURRENT_YEAR}` }),
    language: z.string().min(1, { message: 'Language must be a non-empty string' }).optional(),
    pages: z.number().min(1, { message: 'Pages must be a positive number' }).optional(),
});



export const CreateBookPayloadSchema = z.object({
    title: z.string().min(1, { message: 'Title must be a non-empty string' }),
    synopsis: z.string().min(30, { message: 'Synopsis must be at least 30 characters long' }),
    authors: z.array(z.string()).min(1, { message: 'At least one author is required' }),
    tags: z.array(z.string()),
    isbn: z.string().min(1, { message: 'ISBN must be a non-empty string' }),
    price: z.number().min(0, { message: 'Price must be a non-negative number' }),
    yearPublished: z.number()
        .int()
        .gte(EARLIEST_YEAR_PUBLISHED, { message: `Year must be at least ${EARLIEST_YEAR_PUBLISHED}` })
        .lte(CURRENT_YEAR, { message: `Year must be at most ${CURRENT_YEAR}` }),
    language: z.string().min(1, { message: 'Language must be a non-empty string' }),
    pages: z.number().min(1, { message: 'Pages must be a positive number' }).max(1500, { message: 'Pages must be less than 1500' }),
});


export const GetBooksQueryParamsSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(booksSortByOptions).optional(),
    sortOrder: z.enum(sortOrderOptions).optional(),
    tags: z.array(z.string()).optional(),
    page: z.string().optional(),
    
    // "coerce" chatgpt = “Accept input as something else, and convert it into this type before validating.”
    priceMin: z.coerce.number().optional(),   
    priceMax: z.coerce.number().optional()
}).refine(
    (data) => {
        // Only invalid when both are provided and ordering is wrong
        if (
            data.priceMin !== undefined &&
            data.priceMax !== undefined &&
            data.priceMin > data.priceMax
        ) {
            return false;
        }

        return true;
    },
    {
        message: 'priceMin must be less than or equal to priceMax',
        path: ['priceMin'],
    }
);


