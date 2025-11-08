import { Router } from 'express';

import { asyncHandler } from '../middlewares';
import { login } from '../services';

export const loginBaseUrl = '/api/login';

const loginRouter = Router();

loginRouter.post('/', asyncHandler(async (req, res, _next) => {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.status(200).json(result);
}));

export default loginRouter;