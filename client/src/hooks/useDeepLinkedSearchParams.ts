import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';


export const useDeepLinkedSearchParams = <T extends Record<string, unknown>>(schema: z.ZodType<T>) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useMemo(() => {
        const raw = Object.fromEntries(searchParams.entries());
        const parsed = schema.safeParse(raw);    // Reason to use safeParse here -> if parse fails, let's set empty object as default. No need to throw err and white page and so on.
        return parsed.success ? parsed.data : schema.parse({});
    }, [searchParams, schema]);

    const updateParams = useCallback(
        (updates: Partial<T>) => {
            const merged = { ...params, ...updates };
            const validated = schema.parse(merged);
            setSearchParams(
                new URLSearchParams(
                    Object.entries(validated).map(([k, v]) => [k, String(v)])
                )
            );
        },
        [params, schema, setSearchParams]
    );

    return { params, updateParams };
};
