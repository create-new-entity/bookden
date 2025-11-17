import { Router } from 'express';

import { asyncHandler } from '../middlewares';
import { postLoginController } from '../controllers';

export const loginBaseUrl = '/api/login';

const loginRouter = Router();

loginRouter.post('/', asyncHandler(postLoginController));

export default loginRouter;