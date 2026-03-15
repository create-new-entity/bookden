import z from 'zod';
import { SqlFragmentToken } from '@slonik/sql-tag';

import { BookTypeAlias } from '../typeAliases';
import {
    CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema
} from '../validation';
import { CamelCaseDeep } from './Utilities';
import { sqlTag } from '../configs';


export type BookDBRow = z.infer<typeof BookTypeAlias>;
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
    limit: number;


    /*
        includePagination is needed, because:
        we don't care about pagination for the homepage book lists - we just want a
        random selection of books that match the criteria, up to the limit,
        and we don't need pagination metadata like total count or total pages.
        But for the regular get books endpoint, we do want pagination and its metadata.
    */
    includePagination: boolean;


    /*
        randomOrder is needed, because:
        For the homepage book lists,
        we want to show a random selection of books that match the criteria,
        not the same books every time based on the sortBy and sortOrder.
    */
    randomOrder: boolean;
};

export type BooksQueryContext = {
    baseWhereFragment?: SqlFragmentToken;
    requestingUserId?: number;
};


type HomepageBookList = {
    key: string;
    title: string;
    books: Book[];
};

export type HomepageBookListsResponse = {
    bookLists: HomepageBookList[];
};

export type HomepageBookListConfig = {
    key: string;
    title: string;
    queryOptions?: Partial<BooksQueryOptions>;
    extraWhereFragment?: (sqTag: typeof sqlTag) => SqlFragmentToken;
};

