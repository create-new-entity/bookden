import type { BOOKS_LIST_SORT_BY_OPTIONS_TEXTS, LANGUAGE_CODES } from '../constants';


export type Book = {
    bookId: number;
    title: string;
    synopsis: string | null;
    authors: string[];
    isbn: string;
    price: number;
    yearPublished: number;
    language: LanguageCode;
    pages: number;
    deletedAt: string | null;
    updatedAt: string | null;
    createdAt: string;
    tags: string[];
}


export type BookTag = {
    tagId: number;
    tag: string;
};

export type BooksSortByOptions = keyof typeof BOOKS_LIST_SORT_BY_OPTIONS_TEXTS;

export type BooksPriceRangeMeta = {
    priceMin: number;
    priceMax: number;
};

export type LanguageCode = typeof LANGUAGE_CODES[number];