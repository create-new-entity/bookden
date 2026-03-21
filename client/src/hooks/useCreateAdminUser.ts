import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';
import type { CreateAdminUserData } from '../validations';
import { createAdminUser } from '../api';
import { AUTH, UNAUTHORIZED_STATUS_CODE, USER_MANAGEMENT } from '../constants';

type UseCreateAdminUserReturn = {
    mutation: UseMutationResult<void, AxiosErrorResponse, CreateAdminUserData>;
};

export const useCreateAdminUser = (): UseCreateAdminUserReturn => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const createAdminUserMutation = useMutation<void, AxiosErrorResponse, CreateAdminUserData>({
        mutationFn: (createUserPayload: CreateAdminUserData) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as a superadmin to create an admin user. Your session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return createAdminUser(createUserPayload, resolvedToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['usersList']
            });
            handleShowNotification('Admin user successfully created.');
            navigate(USER_MANAGEMENT);
        },
        onError: (error) => {
            handleShowNotification('Failed to create admin user.');
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    return { mutation: createAdminUserMutation };
};
