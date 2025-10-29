import { Router, Response, Request } from 'express';
import { createUser } from '../controllers';

/*
    For testing purposes, we need a superadmin in place.
    Before each test db is emptied.
    Endpoints in this file are not meant to be on production.
*/

export const testBaseUrl = '/api/test';

const testRouter = Router();

testRouter.post('/users', async (req: Request, res: Response) => {
    try {
        await createUser(req.body);
        res.status(201).end();
    } catch (error) {
        res.status(500).json({ error: JSON.stringify(error) });
    }
});


export default testRouter;
