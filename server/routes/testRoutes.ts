import { Router, Response, Request } from 'express';
import { createUser } from '../services';
import { asyncHandler } from '../middlewares';

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


export default testRouter;
