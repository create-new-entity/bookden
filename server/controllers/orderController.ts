
import QueryString from 'qs';
import { Response, NextFunction } from 'express';

import { ADMIN, AuthenticatedRequest, SUPERADMIN } from '../types';
import { CreateOrderRequestBody, OrdersQueryParams } from '../types/Order';
import { CreateOrderRequestSchema, GetOrderRequestSchema, GetOrdersQueryParamsSchema } from '../validation/order';
import { createOrder, getOrder, getOrders } from '../services/orderService';
import {
    AuthenticationError, BadRequestError, errorMessages,
    errorNames, UnauthorizedError
} from '../errors';


const createOrderController = async (req: AuthenticatedRequest<QueryString.ParsedQs, CreateOrderRequestBody>, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const userType = req.user?.userType;

    if(!userId || !userType) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const validated = CreateOrderRequestSchema.parse(req.body);
    const { items } = validated;

    const bookIds = items.map(item => item.bookId);

    if (new Set(bookIds).size !== bookIds.length) {
        const duplicateBookIdsError = new BadRequestError(errorMessages[errorNames.duplicateBookIds]);
        throw duplicateBookIdsError;
    }

    const isUserAdminOrSuperadmin = userType === ADMIN || userType === SUPERADMIN;
    if(isUserAdminOrSuperadmin) {
        const unauthorizedError = new UnauthorizedError(errorMessages[errorNames.onlyCustomersCanCreateOrders]);
        throw unauthorizedError;
    }

    const orderId = await createOrder(userId, items);

    res.status(201).json({ orderId });
};

const getOrdersController = async (req: AuthenticatedRequest<QueryString.ParsedQs, OrdersQueryParams>, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const userType = req.user?.userType;

    if(!userId || !userType) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const validated = GetOrdersQueryParamsSchema.parse(req.query);
    const { page, limit, sortBy, sortOrder } = validated;

    const orders = await getOrders({ userId, userType, page, limit, sortBy, sortOrder });
    res.status(200).json(orders);
};

const getOrderController = async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const userId = req.user?.userId;
    const userType = req.user?.userType;

    if(!userId || !userType) {
        const loginRequiredError = new AuthenticationError();
        throw loginRequiredError;
    }

    const validated = GetOrderRequestSchema.parse(req.params);
    const { orderId } = validated;

    const order = await getOrder(orderId, userId, userType);
    res.status(200).json(order);
};

export {
    createOrderController,
    getOrdersController,
    getOrderController
};