import * as z from 'zod';
import { ADMIN, CUSTOMER } from '../types';

export const User = z.object({
    username: z.string().min(6).max(30),
    password: z.string().min(6).max(30),
    email: z.string().email().max(250),
    userType: z.enum([ADMIN, CUSTOMER])
});

export const UpdateUser = z.object({
    username: z.string().min(6).max(30).optional(),
    password: z.string().min(6).max(30).optional(),
    email: z.string().email().max(250).optional()
});