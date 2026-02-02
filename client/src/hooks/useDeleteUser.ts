import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteUser } from '../api';
import type { AxiosErrorResponse } from '../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';



export const useDeleteUser = (userId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const deleteUserMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => deleteUser(token, userId),
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

