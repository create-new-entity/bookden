import { Router } from 'express';

import { asyncHandler, enforceAuthentication, tokenExtractor } from '../middlewares';
import { createOrderController, getOrdersController, getOrderController } from '../controllers';

export const orderBaseUrl = '/api/orders';

const orderRouter = Router();

orderRouter.post('/', tokenExtractor, enforceAuthentication, asyncHandler(createOrderController));
orderRouter.get('/:orderId', tokenExtractor, enforceAuthentication, asyncHandler(getOrderController));
orderRouter.get('/', tokenExtractor, enforceAuthentication, asyncHandler(getOrdersController));

export default orderRouter;