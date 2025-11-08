import { Router } from 'express';
import login from '../controllers/login';
import { asyncHandler } from '../middlewares/asyncHandler';

export const loginBaseUrl = '/api/login';

const loginRouter = Router();

loginRouter.post('/', asyncHandler(async (req, res, _next) => {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.status(200).json(result);
}));

export default loginRouter;