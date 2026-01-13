
import { z, type RefinementCtx } from 'zod';

import {
    MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, MAX_USERNAME_LENGTH,
    MIN_USERNAME_LENGTH, MAX_EMAIL_LENGTH, MIN_EMAIL_LENGTH
} from '../constants';

export const LogInResolver = z.object({
    username: z.string().trim().toLowerCase().min(6).max(30),
    password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH)
});



const SignUpUserResolverWithoutRefine = z.object({
    username: z.string().trim().toLowerCase().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH),
    password: z.string().trim().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
    email: z.email('Please enter a valid email address.').trim().toLowerCase().min(MIN_EMAIL_LENGTH).max(MAX_EMAIL_LENGTH),
    confirmPassword: z.string()
});
type SignUpUserData = z.infer<typeof SignUpUserResolverWithoutRefine>;




const updateUsernameSchema = z.string()
    .trim()
    .toLowerCase()
    .optional()
    // Partial update is allowed, user may skip updating username, hence !val || val.length >= 6.
    .refine((val) => !val || val.length >= MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`)
    .refine((val) => !val || val.length <= MAX_USERNAME_LENGTH, `Username must be at most ${MAX_USERNAME_LENGTH} characters`);

const updatePasswordSchema = z.string()
    .trim()
    .optional()
    // Partial update is allowed, user may skip updating password, hence !val || val.length >= 6.
    .refine((val) => !val || val.length >= MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .refine((val) => !val || val.length <= MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`);

const updateEmailSchema = z.string()
    .trim()
    .toLowerCase()
    .optional()
    // Partial update is allowed, user may skip updating email, hence !val || val.length >= 6.
    .refine((val) => !val || val.length >= MIN_EMAIL_LENGTH, `Email must be at least ${MIN_EMAIL_LENGTH} characters`)
    .refine((val) => !val || val.length <= MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters`);

const UpdateUserResolverWithoutRefine = z.object({
    username: updateUsernameSchema,
    password: updatePasswordSchema,
    email: updateEmailSchema,
    confirmPassword: z.string().optional()
});

export type UpdateUserData = z.infer<typeof UpdateUserResolverWithoutRefine>;

export type UpdateUserFormFields = {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
};



const createUsernameSchema = z.string()
    .trim()
    .toLowerCase()
    .min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters`)
    .max(MAX_USERNAME_LENGTH, `Username must be at most ${MAX_USERNAME_LENGTH} characters`);

const createPasswordSchema = z.string()
    .trim()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`);

const createEmailSchema = z.string()
    .trim()
    .toLowerCase()
    .min(MIN_EMAIL_LENGTH, `Email must be at least ${MIN_EMAIL_LENGTH} characters`)
    .max(MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters`);

const CreateAdminUserResolverWithoutRefine = z.object({
    username: createUsernameSchema,
    password: createPasswordSchema,
    email: createEmailSchema,
    confirmPassword: z.string().optional()
});

export type CreateAdminUserData = z.infer<typeof CreateAdminUserResolverWithoutRefine>;




const isPasswordAndConfirmPasswordSame = (data: SignUpUserData | UpdateUserData | CreateAdminUserData, ctx: RefinementCtx) => {
    if (data.password && data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            path: ['confirmPassword'],
            message: 'Passwords do not match.',
        });
    }
};



export const SignUpUserResolver = SignUpUserResolverWithoutRefine.superRefine(isPasswordAndConfirmPasswordSame);
export const UpdateUserResolver = UpdateUserResolverWithoutRefine.superRefine(isPasswordAndConfirmPasswordSame);
export const CreateAdminUserResolver = CreateAdminUserResolverWithoutRefine.superRefine(isPasswordAndConfirmPasswordSame);

export type UpdateUserFormData = z.infer<typeof UpdateUserResolverWithoutRefine>;
export type CreateAdminUserFormData = z.infer<typeof CreateAdminUserResolverWithoutRefine>;