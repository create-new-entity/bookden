import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { restoreUser } from '../api';
import type { AxiosErrorResponse } from '../types';
import { useAuthContext, useNotificationContext } from '../contexts';
import { AUTH } from '../constants';



export const useRestoreUser = (userId: number) => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const restoreUserMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as a superadmin to restore a user. Session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return restoreUser(resolvedToken, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            handleShowNotification('User restored successfully.');
        }
    });

    return { restoreUserMutation };
};

