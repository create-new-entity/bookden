import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUsersList } from '../api';
import { useAuthContext, useNotificationContext } from '../contexts';
import type { UserSearchParams } from '../validations';
import type { AxiosErrorResponse, PaginatedDataList, User } from '../types';
import { useUserManagementDeepLinking } from './useUserManagementDeepLinking';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';


type UseUsersListReturn = {
    usersList: UseQueryResult<PaginatedDataList<User>, Error>;
    params: UserSearchParams;
    updateParams: (params: Partial<UserSearchParams>) => void;
};

export const useUsersList = (): UseUsersListReturn => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { params, updateParams } = useUserManagementDeepLinking();
    const navigate = useNavigate();
    const { handleShowNotification } = useNotificationContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const { search, page, sortBy, sortOrder, userType } = params;

    const queryFn = () => {
        const userTypeQuery = userType === 'all' ? '' : userType;
        if(!resolvedToken) {
            navigate(AUTH);
            handleShowNotification('You need to be logged in as a superadmin to get users list. Session expired or user deleted. Please try again.');
            return Promise.resolve({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } });
        }
        return getUsersList({ search, page, sortBy, sortOrder, userType: userTypeQuery }, resolvedToken);
    };

    const usersList = useQuery<PaginatedDataList<User>, AxiosErrorResponse>({
        queryKey: ['usersList', search, page, sortBy, sortOrder, userType, token],
        queryFn,
        retry: false,
        enabled: !!token,
    });

    useEffect(() => {
        if(usersList.isError && usersList.error?.response?.status === UNAUTHORIZED_STATUS_CODE) {
            handleShowNotification('Session expired or user deleted. Please log in again.');
            navigate(AUTH);
        }
        else if(usersList.isError) {
            handleShowNotification('Failed to get users list.');
        }
    }, [usersList.isError, usersList.error?.response?.status, navigate, handleShowNotification]);
    
    return { usersList, params, updateParams };
};
