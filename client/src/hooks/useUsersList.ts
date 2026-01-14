import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getUsersList } from '../api';
import { useAuthContext } from '../contexts';
import type { UserSearchParams } from '../validations';
import type { PaginatedDataList, User } from '../types';
import { useUserManagementDeepLinking } from './useUserManagementDeepLinking';


type UseUsersListReturn = {
    usersList: UseQueryResult<PaginatedDataList<User>, Error>;
    params: UserSearchParams;
    updateParams: (params: Partial<UserSearchParams>) => void;
};

export const useUsersList = (): UseUsersListReturn => {
    const { token } = useAuthContext();
    const { params, updateParams } = useUserManagementDeepLinking();

    const { search, page, sortBy, sortOrder, userType } = params;

    const queryFn = () => {
        const userTypeQuery = userType === 'all' ? '' : userType;
        return getUsersList({ search, page, sortBy, sortOrder, userType: userTypeQuery }, token);
    };

    const usersList = useQuery({
        queryKey: ['usersList', search, page, sortBy, sortOrder, userType, token],
        queryFn
    });
    
    return { usersList, params, updateParams };
};
