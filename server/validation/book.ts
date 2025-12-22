import { z } from 'zod';
import { booksSortByOptions, sortOrderOptions } from '../constants';


export const UpdateBookPayloadSchema = z.object({
    title: z.string().min(1, { message: 'Title must be a non-empty string' }).optional(),
    synopsis: z.string().optional(),
    tags: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    isbn: z.string().min(1, { message: 'ISBN must be a non-empty string' }).optional(),
    price: z.number().min(0, { message: 'Price must be a non-negative number' }).optional(),
    yearPublished: z.string().date().optional(),
    language: z.string().min(1, { message: 'Language must be a non-empty string' }).optional(),
    pages: z.number().min(1, { message: 'Pages must be a positive number' }).optional(),
});


export const CreateBookPayloadSchema = z.object({
    title: z.string().min(1, { message: 'Title must be a non-empty string' }),
    synopsis: z.string().min(30, { message: 'Synopsis must be at least 30 characters long' }),
    authors: z.array(z.string()).min(1, { message: 'At least one author is required' }),
    isbn: z.string().min(1, { message: 'ISBN must be a non-empty string' }),
    price: z.number().min(0, { message: 'Price must be a non-negative number' }),
    yearPublished: z.number()
        .int()
        .gte(1300, { message: 'Year must be at least 1300' })
        .lte(2025, { message: 'Year cannot exceed 2025' }),
    language: z.string().min(1, { message: 'Language must be a non-empty string' }),
    pages: z.number().min(1, { message: 'Pages must be a positive number' }).max(1500, { message: 'Pages must be less than 1500' }),
});


export const GetBooksQueryParamsSchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(booksSortByOptions).optional(),
    sortOrder: z.enum(sortOrderOptions).optional(),
    tags: z.array(z.string()).optional(),
    page: z.string().optional(),
});


