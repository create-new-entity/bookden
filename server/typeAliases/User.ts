
import { z } from 'zod';
import { userTypes } from '../constants';

export const UserTypeAlias = z.object({
    user_id: z.number(),
    username: z.string(),
    email: z.string(),
    password_hash: z.string(),
    user_type: z.enum(userTypes),
    deleted_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    created_at: z.string(),
});
