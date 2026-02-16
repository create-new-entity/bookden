import z from 'zod';
import { SqlFragmentToken } from '@slonik/sql-tag';

import { BookTypeAlias } from '../typeAliases';
import {
    CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema
} from '../validation';
import { CamelCaseDeep } from './Utilities';


export type BookDBRow = z.infer<typeof BookTypeAlias>;
// export type Book = CamelCaseKeys<BookDBRow>;
export type Book = CamelCaseDeep<Omit<BookDBRow, 'created_at' | 'updated_at' | 'deleted_at'>> & {
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
};
export type UpdateBookPayload = z.infer<typeof UpdateBookPayloadSchema>;
export type CreateBookPayload = z.infer<typeof CreateBookPayloadSchema>;

export type CreateBookRequestBody = {
    payload: string;
};


export type BooksSortByOptions = 'title' | 'price' | 'yearPublished' | 'createdAt' | 'updatedAt' | 'deletedAt';
export type BooksSortOrderOptions = 'asc' | 'desc';
export type GetBooksQueryParams = z.infer<typeof GetBooksQueryParamsSchema>;

export type PriceRange = {
    priceMin: number;
    priceMax: number;
};


export type BooksQueryOptions = {
    includeDeleted: boolean;
    search: string;
    sortBy: BooksSortByOptions;
    sortOrder: BooksSortOrderOptions;
    tags: string[];
    priceRanges: PriceRange;
    page: number;
};

export type BooksQueryContext = {
    baseWhereFragment?: SqlFragmentToken;
    requestingUserId?: number;
};
