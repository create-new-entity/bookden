import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import type { AxiosErrorResponse } from '../types';
import type { UpdateUserPayload } from '../types/UpdateUser';
import { updateProfile } from '../api/profile';
import { useAuthContext, useNotificationContext } from '../contexts';


const useUpdateProfile = () => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const updateProfileMutation = useMutation<AxiosResponse, AxiosErrorResponse, UpdateUserPayload>({
        mutationFn: (updateUserPayload: UpdateUserPayload) => {
            return updateProfile(updateUserPayload, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['me']
            });
            handleShowNotification('Profile successfully updated.');
        },
        onError: (_error) => {
            handleShowNotification('Failed to update profile.');
        }
    });

    return updateProfileMutation;
};

export default useUpdateProfile;