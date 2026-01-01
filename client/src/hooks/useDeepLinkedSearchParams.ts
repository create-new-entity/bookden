import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { removeEmptyValues } from '../utility';

export type UpdateMode = 'merge' | 'replace';

export const useDeepLinkedSearchParams = <T extends Record<string, unknown>>(
    schema: z.ZodType<T>
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const params = useMemo(() => {
        const raw = Object.fromEntries(searchParams.entries());
        const parsed = schema.safeParse(raw);

        // If parsing fails, fall back to schema defaults / empty
        return parsed.success ? parsed.data : schema.parse({});
    }, [searchParams, schema]);

    const updateParams = useCallback(
        (updates: Partial<T>, mode: UpdateMode = 'merge') => {
            const next =
        mode === 'replace'
            ? updates
            : { ...params, ...updates };

            const validated = schema.parse(removeEmptyValues(next));

            setSearchParams(
                new URLSearchParams(
                    Object.entries(validated).map(([k, v]) => [k, String(v)])
                )
            );
        },
        [params, schema, setSearchParams]
    );

    const resetParams = useCallback(() => {
        setSearchParams(new URLSearchParams());
    }, [setSearchParams]);

    return { params, updateParams, resetParams };
};
