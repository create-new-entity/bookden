import { Response } from 'express';
import QueryString from 'qs';
import * as R from 'ramda';

import { ADMIN, AuthenticatedRequest, CreateBookPayload, GetBooksQueryParams, SUPERADMIN } from '../types';
import { createBook, deleteBook, getAllBooks, getBook, updateBook } from '../services';
import { AuthenticationError, BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
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

const createBookController = async (req: AuthenticatedRequest<QueryString.ParsedQs, CreateBookPayload>, res: Response) => {
    if(!req.user) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const userIsAdminOrSuperadmin = req.user.userType === ADMIN || req.user.userType === SUPERADMIN;
    if(!userIsAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError();
        throw unauthorizedError;
    }

    const validated = CreateBookPayloadSchema.parse(req.body);
    if(R.isEmpty(validated)) {
        const badRequestError = new BadRequestError('No fields to create');
        throw badRequestError;
    }

    const createdBook = await createBook(validated);
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
        const invalidBookIdError = new BadRequestError('Invalid book ID');
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



export {
    getAllBooksController,
    getBookController,
    createBookController,
    updateBookController,
    deleteBookController
};