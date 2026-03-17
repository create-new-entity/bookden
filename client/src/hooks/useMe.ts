import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { getMe } from '../api/profile';
import type { LoggedInUserData } from '../types';
import { AUTH, CACHE_TIME_FOR_ME_QUERY } from '../constants';
import { useAuthContext } from '../contexts';


export const useMe = (token: string) => {
    const { hasExistingLoggedInUser } = useAuthContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const navigate = useNavigate();

    const meQuery = useQuery<Omit<LoggedInUserData, | 'token' >>({
        queryKey: ['me', token],  // Note to future self: https://chatgpt.com/share/6981f77f-32c4-8012-bb52-f668790f8f02
        queryFn: async () => {
            const me = await getMe(resolvedToken || '');
            return me;
        },
        enabled: !!resolvedToken,
        retry: false,
        staleTime: CACHE_TIME_FOR_ME_QUERY, // Data is not good after this time.
        gcTime: CACHE_TIME_FOR_ME_QUERY, // Remove data from cache after this time.
        refetchOnMount: false,
        refetchOnWindowFocus: false, // Don't refetch on window focus.
    });

    useEffect(() => {
        const shouldLoginAgain = meQuery.isError && meQuery.isFetched;
        if (shouldLoginAgain) {
            navigate(AUTH);
        }
    }, [meQuery.isFetched, meQuery.isError, navigate]);

    return R.pick(['data', 'isSuccess', 'isLoading', 'isError', 'failureReason', 'isPending'], meQuery); // Not to future self: For later read: https://chatgpt.com/share/6981f8e2-2fc0-8012-9cae-b8fdb7f3f570
};
