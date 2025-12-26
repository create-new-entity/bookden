import type { BOOKS_LIST_SORT_BY_OPTIONS_TEXTS } from '../constants';


export type Book = {
    bookId: number;
    title: string;
    synopsis: string | null;
    authors: string[];
    isbn: string;
    price: number;
    yearPublished: number;
    language: string;
    pages: number;
    deletedAt: string | null;
    updatedAt: string | null;
    createdAt: string;
}

export type BooksSortByOptions = keyof typeof BOOKS_LIST_SORT_BY_OPTIONS_TEXTS;