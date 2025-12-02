import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import type { AxiosErrorResponse } from '../types';
import { updateProfile } from '../api';
import { useAuthContext, useNotificationContext } from '../contexts';
import type { UpdateUserFormData } from '../validations';

export type UseUpdateProfileReturn = {
    mutation: UseMutationResult<AxiosResponse, AxiosErrorResponse, UpdateUserFormData>;
};

const useUpdateProfile = (): UseUpdateProfileReturn => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const updateProfileMutation = useMutation<AxiosResponse, AxiosErrorResponse, UpdateUserFormData>({
        mutationFn: (updateUserPayload: UpdateUserFormData) => {
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

    return { mutation: updateProfileMutation };
};

export default useUpdateProfile;