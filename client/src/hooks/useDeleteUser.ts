import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteUser } from '../api';
import type { AxiosErrorResponse } from '../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';



export const useDeleteUser = (userId: number) => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const deleteUserMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as a superadmin to delete a user. Session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return deleteUser(resolvedToken, userId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            handleShowNotification('User deleted successfully.');
        },
        onError: (error) => {
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired. Please log in again.');
                navigate(AUTH);
            }
            else {
                handleShowNotification('Failed to delete user.');
            }
        }
    });

    return { deleteUserMutation };
};

