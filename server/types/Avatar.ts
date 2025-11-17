import { z } from 'zod';
import { avatarMimeTypes } from '../constants';

export const AvatarTypeAlias = z.object({
    avatar_id: z.number(),
    avatar: z.instanceof(Buffer),
    user_id: z.number(),
    mime_type: z.enum(avatarMimeTypes),
    uploaded_at: z.string()
});
