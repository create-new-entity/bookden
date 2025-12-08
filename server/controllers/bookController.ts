import { Response } from 'express';
import QueryString from 'qs';
import * as R from 'ramda';

import { ADMIN, AuthenticatedRequest, CreateBookRequestBody, GetBooksQueryParams, SUPERADMIN } from '../types';
import { createBook, deleteBook, deleteBookCover, getAllBooks, getBook, getBookCover, updateBook, updateBookCover } from '../services';
import { AuthenticationError, BadRequestError, errorMessages, errorNames, NotFoundError, UnauthorizedError } from '../errors';
import { UpdateBookPayload } from '../types';
import { CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema } from '../validation';


const getAllBooksController = async (req: AuthenticatedRequest<GetBooksQueryParams>, res: Response) => {
    let includeDeleted = false;
    if(req.user) {
        includeDeleted = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    };
    const validatedQueryParams = GetBooksQueryParamsSchema.parse(req.query);
    const validatedPage = (validatedQueryParams.page && parseInt(validatedQueryParams.page, 10)) || 1;
    const books = await getAllBooks(includeDeleted, validatedPage, validatedQueryParams.search, validatedQueryParams.sortBy, validatedQueryParams.sortOrder);
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
        -H "Authorization: Bearer <token of superadmin or admin>" \
        -H "Content-Type: multipart/form-data" \
        -F 'payload={
                "title":"Mockingbird new book",
                "synopsis":"This is a new book for sure. It is about testing the book creation endpoint.",
                "authors":["John Doe"],
                "isbn":"9780743331199",
                "price":100,
                "yearPublished":2025,
                "language":"en",
                "pages":100
            };type=application/json' \
        -F "coverImage=@<Absolute path to book cover image>"

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

    const validated = CreateBookPayloadSchema.parse(JSON.parse(req.body.payload));

    if(!req.file) {
        const noFileUploadedError = new BadRequestError(errorMessages[errorNames.noCoverImageUploaded]);
        throw noFileUploadedError;
    }

    const createdBook = await createBook(validated, req.file.buffer, req.file.mimetype);
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

    await updateBook(bookId, validated);
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



export {
    getAllBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController,
    getBookCoverController,
    updateBookCoverController,
    deleteBookCoverController
};