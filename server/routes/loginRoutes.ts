import { Router } from 'express';
import login from '../controllers/login';

export const loginBaseUrl = '/api/login';

const loginRouter = Router();

loginRouter.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await login(username, password);
        res.status(200).json(token);
    }
    catch (error) {
        next(error);
    }
});

export default loginRouter;