import { UserTypes } from './User';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: JWTSignPayload; // You can replace `any` with a more specific type for your JWT payload
}

export type JWTSignPayload = {
    userId: string;
    username: string;
    userType: UserTypes;
};