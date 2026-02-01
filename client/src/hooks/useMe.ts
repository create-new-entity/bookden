import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';

import { getMe } from '../api/profile';
import type { LoggedInUserData } from '../types';
import { useNavigate } from 'react-router-dom';
import { AUTH } from '../constants';
import { useEffect } from 'react';

export const useMe = (token: string) => {
    const navigate = useNavigate();

    const meQuery = useQuery<Omit<LoggedInUserData, | 'token' >>({
        queryKey: ['me'],
        queryFn: async () => {
            const me = await getMe(token);
            return me;
        },
        retry: false,
        enabled: !!token
    });

    useEffect(() => {
        if(!meQuery.isPending && meQuery.isError) {
            navigate(AUTH);
        }
    }, [meQuery.isPending, meQuery.isError, navigate]);

    return R.pick(['data', 'isSuccess', 'isLoading', 'isError', 'failureReason'], meQuery);
};
