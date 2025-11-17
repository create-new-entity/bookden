
import { z, type RefinementCtx } from 'zod';

export const LogInResolver = z.object({
    username: z.string().trim().toLowerCase().min(6).max(30),
    password: z.string().min(6).max(250)
});

const SignUpUserResolverWithoutRefine = z.object({
    username: z.string().trim().toLowerCase().min(6).max(30),
    password: z.string().trim().min(6).max(250),
    email: z.email('Please enter a valid email address.').trim().toLowerCase().min(5).max(250),
    confirmPassword: z.string()
});

const UpdateUserResolverWithoutRefine = z.object({
    username: z.string()
        .trim()
        .toLowerCase()
        .optional()
        // Partial update is allowed, user may skip updating username, hence !val || val.length >= 6.
        .refine((val) => !val || val.length >= 6, 'Username must be at least 6 characters')
        .refine((val) => !val || val.length <= 30, 'Username must be at most 30 characters'),
    password: z.string()
        .trim()
        .optional()
        // Partial update is allowed, user may skip updating password, hence !val || val.length >= 6.
        .refine((val) => !val || val.length >= 6, 'Password must be at least 6 characters')
        .refine((val) => !val || val.length <= 250, 'Password must be at most 30 characters'),
    email: z.string()
        .trim()
        .toLowerCase()
        // Partial update is allowed, user may skip updating email, hence !val || val.length >= 6.
        .refine((val) => !val || val.length >= 6, 'Email must be at least 6 characters')
        .refine((val) => !val || val.length <= 250, 'Email must be at most 30 characters')
        .optional(),
    confirmPassword: z.string().optional()
});

type SignUpUserData = z.infer<typeof SignUpUserResolverWithoutRefine>;
type UpdateUserData = z.infer<typeof UpdateUserResolverWithoutRefine>;

const isPasswordAndConfirmPasswordSame = (data: SignUpUserData | UpdateUserData, ctx: RefinementCtx) => {
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

export type UpdateUserFormData = z.infer<typeof UpdateUserResolverWithoutRefine>;