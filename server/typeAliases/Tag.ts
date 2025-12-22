

import { z } from 'zod';

export const TagTypeAlias = z.object({
    tag_id: z.number(),
    tag: z.string()
});
