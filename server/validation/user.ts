import * as z from 'zod';
import { ADMIN, CUSTOMER } from '../types';

export const User = z.object({
    username: z.string().min(6).max(30),
    password: z.string().min(6).max(30),
    email: z.string().email().max(250),
    userType: z.enum([ADMIN, CUSTOMER])
});

export const UpdateUser = z.object({
    username: z.string().trim().optional()
        .refine(val => !val || val.length >= 6, 'Username must be at least 6 characters')
        .refine(val => !val || val.length <= 50, 'Username must be at most 50 characters'),
    password: z
        .string().trim().optional()
        .refine(val => !val || val.length >= 6, 'Password must be at least 6 characters')
        .refine(val => !val || val.length <= 50, 'Password must be at most 50 characters'),
    email: z
        .string()
        .trim()
        .optional()
        .superRefine((val, ctx) => {
            if (!val) return; // skip validation if undefined or empty
        
            if (val.length < 6 || val.length > 50) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Email must be 6 - 50 characters in length',
                });
            }
        
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Invalid email format',
                });
            }
        })
});