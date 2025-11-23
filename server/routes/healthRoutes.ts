

import { Router } from 'express';

import { asyncHandler } from '../middlewares';
import { healthController } from '../controllers';


export const healthBaseUrl = '/api/health';

const healthRouter = Router();
healthRouter.get('/', asyncHandler(healthController));

export default healthRouter;