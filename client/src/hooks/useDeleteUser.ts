import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteUser } from '../api';
import type { AxiosErrorResponse } from '../types';


export const useDeleteUser = (userId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const deleteUserMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => deleteUser(token, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            handleShowNotification('User deleted successfully.');
        }
    });

    return { deleteUserMutation };
};

