import { Request, Response, NextFunction } from 'express';

import { login } from '../services';
import { LoginSchema } from '../validation';

const postLoginController = async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = LoginSchema.parse(req.body);
    const result = await login(username, password);
    res.status(200).json(result);
};

export {
    postLoginController
};