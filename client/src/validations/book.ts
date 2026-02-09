import z from 'zod';

import { LANGUAGE_CODES, MAX_BOOK_TITLE_LENGTH } from '../constants';


const titleSchema = z.string()
    .trim()
    .min(1, 'Title is required')
    .max(MAX_BOOK_TITLE_LENGTH, `Title must be less than ${MAX_BOOK_TITLE_LENGTH} characters`);

const authorsSchema = z
    .array(z.string().transform((s) => s.trim()))
    .transform((arr) => Array.from(new Set(arr)).filter((s) => s.length > 0))
    .refine((arr) => arr.length >= 1, { message: 'At least one author is required' });

const synopsisSchema = z.string().min(30, 'Synopsis must be at least 30 characters');

const isbnSchema = z.string().length(13, 'ISBN must be 13 characters');

export const CURRENT_YEAR = new Date().getFullYear();
const EARLIEST_YEAR_PUBLISHED = 1200;
const yearPublishedSchema = z
    .coerce.number()
    .int('Year must be an integer')
    .min(EARLIEST_YEAR_PUBLISHED, `Year must be ≥ ${EARLIEST_YEAR_PUBLISHED}`)
    .max(CURRENT_YEAR, `Year must be ≤ ${CURRENT_YEAR}`);

const priceSchema = z
    .coerce.number()
    .min(0, 'Price must be ≥ 0');

const pagesSchema = z
    .coerce.number()
    .int('Pages must be an integer')
    .min(1, 'Pages must be ≥ 1');

const tagsSchema = z.array(z.string());

const languageCodeSchema = z.enum(LANGUAGE_CODES);


export const CreateUpdateBookResolver = z.object({
    title: titleSchema,
    authors: authorsSchema,
    synopsis: synopsisSchema,
    isbn: isbnSchema,
    yearPublished: yearPublishedSchema,
    price: priceSchema,
    pages: pagesSchema,
    tags: tagsSchema,
    language: languageCodeSchema
});

export type CreateUpdateBookData = z.infer<typeof CreateUpdateBookResolver>;