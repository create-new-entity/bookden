

import { Request, Response, NextFunction } from 'express';


const healthController = async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ message: 'Health check ok'});
};

export {
    healthController
};