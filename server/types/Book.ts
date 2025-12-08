import z from 'zod';
import { CamelCaseKeys } from 'camelcase-keys';

import { BookTypeAlias } from '../typeAliases';
import { CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema } from '../validation';


export type BookDBRow = z.infer<typeof BookTypeAlias>;
export type Book = CamelCaseKeys<BookDBRow>;
export type UpdateBookPayload = z.infer<typeof UpdateBookPayloadSchema>;
export type CreateBookPayload = z.infer<typeof CreateBookPayloadSchema>;

export type CreateBookRequestBody = {
    payload: string;
};


export type BooksSortByOptions = 'title' | 'authors' | 'yearPublished' | 'createdAt' | 'updatedAt' | 'deletedAt';
export type BooksSortOrderOptions = 'asc' | 'desc';
export type GetBooksQueryParams = z.infer<typeof GetBooksQueryParamsSchema>;
