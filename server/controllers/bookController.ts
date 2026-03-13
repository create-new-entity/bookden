import { Response, Request } from 'express';
import QueryString from 'qs';
import * as R from 'ramda';

import {
    ADMIN, AuthenticatedRequest, BooksQueryOptions, CreateBookRequestBody,
    CUSTOMER,
    GetBooksQueryParams, isString, SUPERADMIN, UpdateBookPayload
} from '../types';
import {
    addBookToWishlist,
    createBook, deleteBook, deleteBookCover,
    getAllBooks, getBook, getBookCover,
    getBooksPriceRange, getHomepageBookLists, getTags, getWishlistedBooks, removeBookFromWishlist, restoreBook, updateBook, updateBookCover
} from '../services';
import {
    AuthenticationError, BadRequestError, errorMessages,
    errorNames, NotFoundError, UnauthorizedError
} from '../errors';
import { CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema } from '../validation';
import { DEFAULT_PRICE_MAX, DEFAULT_PRICE_MIN } from '../constants';


const getAllBooksController = async (req: AuthenticatedRequest<GetBooksQueryParams>, res: Response) => {
    let includeDeleted = false;
    if(req.user) {
        includeDeleted = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    };
    const rawTags = req.query.tags;

    const normalizedTags = isString(rawTags) ? rawTags.split(',') : [];

    const validatedQueryParams = GetBooksQueryParamsSchema.parse({
        ...req.query,
        tags: normalizedTags,
    });
    const priceRanges = (validatedQueryParams.priceMin || validatedQueryParams.priceMax) ? {
        priceMin: validatedQueryParams.priceMin ?? DEFAULT_PRICE_MIN,
        priceMax: validatedQueryParams.priceMax ?? DEFAULT_PRICE_MAX
    } : undefined;
    const validatedPage = (validatedQueryParams.page && parseInt(validatedQueryParams.page, 10)) || 1;
    
    const options: Partial<BooksQueryOptions> = {
        ...validatedQueryParams,
        priceRanges: priceRanges,
        page: validatedPage,
        includeDeleted
    };
    const books = await getAllBooks(options, req.user?.userId);
    
    res.status(200).json(books);
};

const getHomePageBooksController = async (_req: Request, res: Response) => {
    const books = await getHomepageBookLists();
    res.status(200).json(books);
};

const getBookController = async (req: AuthenticatedRequest, res: Response) => {
    const bookId = parseInt(req.params.id, 10);
    
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError('Invalid book ID');
        throw invalidBookIdError;
    }

    let includeDeleted = false;
    if(req.user) {
        includeDeleted = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    };

    const book = await getBook(bookId, includeDeleted);
    if(!book) {
        const bookNotFoundError = new NotFoundError();
        throw bookNotFoundError;
    }

    res.status(200).json(book);
};

const getBookCoverController = async (req: AuthenticatedRequest, res: Response) => {
    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }
    const includeDeleted = req.user?.userType === ADMIN || req.user?.userType === SUPERADMIN || false;
    const bookCover = await getBookCover(bookId, includeDeleted);
    if(!bookCover) {
        const bookCoverNotFoundError = new NotFoundError(errorMessages[errorNames.bookCoverNotFound]);
        throw bookCoverNotFoundError;
    }

    const responseHeaders = {
        'Content-Type': bookCover.mimeType,
        'Content-Disposition': 'inline', // Browser should try to display it inside the browser window
    };

    res.set(responseHeaders);
    res.end(bookCover.imageData);
};

const createBookController = async (req: AuthenticatedRequest<QueryString.ParsedQs, CreateBookRequestBody>, res: Response) => {

    /* 
    
        How to create a book with a cover image from terminal:

        curl -X POST http://localhost:3000/api/books \
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc2ODI2NTkwMCwiZXhwIjoxNzY4MzUyMzAwfQ.yBszDc5DW9jV4AI22gty2NSN5ZVpU1qTIL7vXL9ifZo" \
        -H "Content-Type: multipart/form-data" \
        -F 'payload={
            "title": "Mockingbird",
            "synopsis": "This is a new book for sure. It is about testing the book creation endpoint.",
            "authors": ["John Doe"],
            "price": 100,
            "language": "en",
            "pages": 100,
            "tags": ["horror"],
            "yearPublished": 2025,
            "isbn": "9780743330004"
        };type=application/json' \
        -F "coverImage=@/Users/mdimranpavel/Desktop/bookden/server/__tests__/files/dummy.jpeg"

    */

    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const payload = typeof req.body.payload === 'string'
        ? JSON.parse(req.body.payload)
        : req.body.payload;

    const validated = CreateBookPayloadSchema.parse(payload);

    if(!req.file) {
        const noFileUploadedError = new BadRequestError(errorMessages[errorNames.noCoverImageUploaded]);
        throw noFileUploadedError;
    }

    const normalizedTags = validated.tags.map(t =>{
        return t.trim().toLowerCase();
    });

    const createdBook = await createBook({ ...validated, tags: normalizedTags }, req.file.buffer, req.file.mimetype);
    res.status(201).json(createdBook);
};

const updateBookController = async (req: AuthenticatedRequest<QueryString.ParsedQs, UpdateBookPayload>, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    const validated = UpdateBookPayloadSchema.parse(req.body);
    if(R.isEmpty(validated)) {
        const badRequestError = new BadRequestError();
        throw badRequestError;
    }

    const normalizedTags = validated.tags?.map(t =>{
        return t.trim().toLowerCase();
    });

    await updateBook(bookId, {
        ...validated,
        tags: normalizedTags
    });
    res.status(200).end();
};

const updateBookCoverController = async (req: AuthenticatedRequest, res: Response) => {

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    if(!req.file) {
        const noFileUploadedError = new BadRequestError(errorMessages[errorNames.noCoverImageUploaded]);
        throw noFileUploadedError;
    }

    await updateBookCover(bookId, req.file.buffer, req.file.mimetype);
    res.status(200).end();
};

const deleteBookController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError();
        throw invalidBookIdError;
    }

    await deleteBook(bookId);
    res.status(200).end();
};

const deleteBookCoverController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }
    
    
    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    await deleteBookCover(bookId);
    res.status(200).end();
};


const getTagsController = async (_req: Request, res: Response) => {
    const tags = await getTags();
    res.status(200).json(tags);
};

const getBooksPriceRangeController = async (_req: Request, res: Response) => {
    const priceRange = await getBooksPriceRange();
    res.status(200).json(priceRange);
};

const restoreBookController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    await restoreBook(bookId);
    res.status(200).end();
};

const addBookToWishlistController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const isUserCustomer = req.user.userType === CUSTOMER;
    if(!isUserCustomer) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    await addBookToWishlist(req.user.userId, bookId);
    res.status(200).end();
};

const removeBookFromWishlistController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const isUserCustomer = req.user.userType === CUSTOMER;
    if(!isUserCustomer) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const bookId = parseInt(req.params.id, 10);
    if(isNaN(bookId) || bookId <= 0 || !Number.isInteger(bookId)) {
        const invalidBookIdError = new BadRequestError(errorMessages[errorNames.invalidBookId]);
        throw invalidBookIdError;
    }

    await removeBookFromWishlist(req.user.userId, bookId);
    res.status(200).end();
    
};

const getWishlistedBooksController = async (req: AuthenticatedRequest, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }
    
    const isUserCustomer = req.user.userType === CUSTOMER;
    if(!isUserCustomer) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const rawTags = req.query.tags;

    const normalizedTags = isString(rawTags) ? rawTags.split(',') : [];

    const validatedQueryParams = GetBooksQueryParamsSchema.parse({
        ...req.query,
        tags: normalizedTags,
    });
    const priceRanges = (validatedQueryParams.priceMin || validatedQueryParams.priceMax) ? {
        priceMin: validatedQueryParams.priceMin ?? DEFAULT_PRICE_MIN,
        priceMax: validatedQueryParams.priceMax ?? DEFAULT_PRICE_MAX
    } : undefined;
    const validatedPage = (validatedQueryParams.page && parseInt(validatedQueryParams.page, 10)) || 1;
    
    const options: Partial<BooksQueryOptions> = {
        ...validatedQueryParams,
        priceRanges: priceRanges,
        page: validatedPage
    };

    const wishlistedBooks = await getWishlistedBooks(options, req.user.userId);
    res.status(200).json(wishlistedBooks);
};


export {
    getAllBooksController,
    getHomePageBooksController,
    getWishlistedBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController,
    getBookCoverController,
    updateBookCoverController,
    deleteBookCoverController,
    getTagsController,
    getBooksPriceRangeController,
    restoreBookController,
    addBookToWishlistController,
    removeBookFromWishlistController
};