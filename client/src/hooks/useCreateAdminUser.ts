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
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const createAdminUserMutation = useMutation<void, AxiosErrorResponse, CreateAdminUserData>({
        mutationFn: (createUserPayload: CreateAdminUserData) => {
            return createAdminUser(createUserPayload, token);
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
