

import { z } from 'zod';

export const VoidTypeAlias = z.object({
    void: z.object({}).strict()
});

