import { Router, Response, Request, NextFunction } from 'express';
import login from '../controllers/login';

const loginRouter = Router();

type LoginPayload = {
    username: string;
    password: string;
};

type LoginResponse = {
    token: string;
}

loginRouter.post('/', async (req: Request<LoginPayload>, res: Response<LoginResponse>, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const result = await login(username, password);
        res.status(200).json(result);
    }
    catch(error) {
        next(error);
    }
});

export default loginRouter;