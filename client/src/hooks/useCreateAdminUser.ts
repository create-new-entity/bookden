import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';
import type { CreateAdminUserData } from '../validations';
import { createAdminUser } from '../api';
import { USER_MANAGEMENT } from '../constants';

export type UseCreateAdminUserReturn = {
    mutation: UseMutationResult<void, AxiosErrorResponse, CreateAdminUserData>;
};

const useCreateAdminUser = (): UseCreateAdminUserReturn => {
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
        onError: (_error) => {
            handleShowNotification('Failed to create admin user.');
        }
    });

    return { mutation: createAdminUserMutation };
};

export default useCreateAdminUser;