import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreUser } from '../api';
import type { AxiosErrorResponse } from '../types';
import { useAuthContext, useNotificationContext } from '../contexts';


export const useRestoreUser = (userId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const restoreUserMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => restoreUser(token, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            handleShowNotification('User restored successfully.');
        }
    });

    return { restoreUserMutation };
};

