import { Router, Response, Request } from 'express';
import { createBook, createUser } from '../services';
import { asyncHandler, uploadImage } from '../middlewares';
import { BadRequestError, errorNames, errorMessages } from '../errors';

/*
    For testing purposes, we need a superadmin in place.
    Before each test db is emptied.
    Endpoints in this file are not meant to be on production.
*/

export const testBaseUrl = '/api/test';

const testRouter = Router();

testRouter.post('/users', asyncHandler(async (req: Request, res: Response) => {
    await createUser(req.body);
    res.status(201).end();
}));

testRouter.post('/books', uploadImage.single('coverImage'), asyncHandler(async (req: Request, res: Response) => {
    if(!req.file) {
        throw new BadRequestError(errorMessages[errorNames.noFileUploaded]);
    };
    await createBook(JSON.parse(req.body.payload), req.file.buffer, req.file.mimetype);
    res.status(201).end();
}));


export default testRouter;
