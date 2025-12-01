import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

import { UserSearchParamsSchema } from '../validations';

const useUsersListDeepLinking = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedParams = useMemo(() => {
        const raw = Object.fromEntries(searchParams.entries());
        const result = UserSearchParamsSchema.safeParse(raw);
        return result.success ? result.data : UserSearchParamsSchema.parse({});
    }, [searchParams]);

    const updateParams = useCallback(
        (updates: Partial<typeof parsedParams>) => {
            const merged = {
                ...parsedParams,
                ...updates
            };

            const validated = UserSearchParamsSchema.parse(merged);

            const newParams = new URLSearchParams(
                Object.entries(validated).map(([k, v]) => [k, String(v)])
            );

            setSearchParams(newParams);
        },
        [parsedParams, setSearchParams]
    );

    return {
        params: parsedParams,
        updateParams
    };
};

export default useUsersListDeepLinking;