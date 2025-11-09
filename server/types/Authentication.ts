import { UserTypes } from './User';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: JWTSignPayload; // You can replace `any` with a more specific type for your JWT payload
}

export type JWTSignPayload = {
    userId: number;
    username: string;
    userType: UserTypes;
};