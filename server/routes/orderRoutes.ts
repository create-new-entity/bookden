import { Router } from 'express';

import { asyncHandler, enforceAuthentication, tokenExtractor } from '../middlewares';
import { createOrderController, getOrdersController, getOrderController } from '../controllers';

export const orderBaseUrl = '/api/orders';

const orderRouter = Router();

orderRouter.get('/:orderId', tokenExtractor, enforceAuthentication, asyncHandler(getOrderController));
orderRouter.get('/', tokenExtractor, enforceAuthentication, asyncHandler(getOrdersController));
orderRouter.post('/', tokenExtractor, enforceAuthentication, asyncHandler(createOrderController));

export default orderRouter;