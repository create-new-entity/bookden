import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { getMe } from '../api/profile';
import type { LoggedInUserData } from '../types';
import { AUTH } from '../constants';


export const useMe = (token: string) => {
    const navigate = useNavigate();

    const meQuery = useQuery<Omit<LoggedInUserData, | 'token' >>({
        queryKey: ['me'],
        queryFn: async () => {
            const me = await getMe(token);
            return me;
        },
        enabled: !!token
        /* 
            Not to future self:
            
            Don't set retry to false.
            Otherwise it will always navigate to auth page after first failure.
        */
    });

    useEffect(() => {
        const shouldLoginAgain = !meQuery.isFetched && !meQuery.isPending && meQuery.isError;
        if (shouldLoginAgain) {
            navigate(AUTH);
        }
    }, [meQuery.isFetched, meQuery.isPending, meQuery.isError, navigate]);

    return R.pick(['data', 'isSuccess', 'isLoading', 'isError', 'failureReason'], meQuery);
};
