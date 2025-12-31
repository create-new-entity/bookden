import { Response, Request } from 'express';
import QueryString from 'qs';
import * as R from 'ramda';

import { ADMIN, AuthenticatedRequest, CreateBookRequestBody, GetBooksQueryParams, isString, SUPERADMIN } from '../types';
import { createBook, deleteBook, deleteBookCover, getAllBooks, getBook, getBookCover, getTags, updateBook, updateBookCover } from '../services';
import { AuthenticationError, BadRequestError, errorMessages, errorNames, NotFoundError, UnauthorizedError } from '../errors';
import { UpdateBookPayload } from '../types';
import { CreateBookPayloadSchema, GetBooksQueryParamsSchema, UpdateBookPayloadSchema } from '../validation';


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
    const validatedPage = (validatedQueryParams.page && parseInt(validatedQueryParams.page, 10)) || 1;
    const books = await getAllBooks(includeDeleted, validatedPage, validatedQueryParams.search, validatedQueryParams.sortBy, validatedQueryParams.sortOrder, validatedQueryParams.tags);
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
        -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW4iLCJ1c2VySWQiOjEsInVzZXJUeXBlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc2NjQzMjUzMCwiZXhwIjoxNzY2NTE4OTMwfQ.-ZzQPKokHAod9kAKGkbFAZkdtxtxDrp7HfYXX65GgEk" \
        -H "Content-Type: multipart/form-data" \
        -F 'payload={
            "title": "Mockingbird new book 2",
            "synopsis": "This is a new book for sure. It is about testing the book creation endpoint.",
            "authors": ["John Doe"],
            "price": 100,
            "language": "en",
            "pages": 100,
            "tags": ["horror"],
            "yearPublished": 2025,
            "isbn": "9780743330000"
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


export {
    getAllBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController,
    getBookCoverController,
    updateBookCoverController,
    deleteBookCoverController,
    getTagsController
};