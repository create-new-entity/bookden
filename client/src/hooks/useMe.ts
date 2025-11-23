import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';

import { getMe } from '../api/profile';
import type { LoggedInUserData } from '../types';

const useMe = (token: string) => {
    const meQuery = useQuery<Omit<LoggedInUserData, | 'token' >>({
        queryKey: ['me'],
        queryFn: async () => {
            const me = await getMe(token);
            return me;
        },
        enabled: !!token
    });
    return R.pick(['data', 'isSuccess', 'isLoading', 'isError', 'failureReason'], meQuery);
};

export default useMe;