import { useQuery } from '@tanstack/react-query';
import * as R from 'ramda';

import { getMe } from '../api/profile';
import { LOGGED_IN_USER_DATA } from '../constants';
import type { LoggedInUserData } from '../types';

const useMe = () => {
    const loggedInUserData = localStorage.getItem(LOGGED_IN_USER_DATA);
    const existingLoggedInData = JSON.parse(loggedInUserData || '{}');
    const meQuery = useQuery<Omit<LoggedInUserData, | 'token' >>({
        queryKey: ['me'],
        queryFn: async () => {
            const me = await getMe(existingLoggedInData.token);
            return me;
        }
    });
    return R.pick(['data', 'isSuccess', 'isLoading', 'isError', 'failureReason'], meQuery);
};

export default useMe;