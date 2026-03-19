import {
    useMutation, useQueryClient, type UseMutationResult
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import type { AxiosErrorResponse } from '../types';
import { updateProfile } from '../api';
import { useAuthContext, useNotificationContext } from '../contexts';
import type { UpdateUserFormData } from '../validations';
import { AUTH, HOME, UNAUTHORIZED_STATUS_CODE } from '../constants';

export type UseUpdateProfileReturn = {
    mutation: UseMutationResult<AxiosResponse | null, AxiosErrorResponse, UpdateUserFormData>;
};

export const useUpdateProfile = (): UseUpdateProfileReturn => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { handleShowNotification } = useNotificationContext();
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const updateProfileMutation = useMutation<AxiosResponse | null, AxiosErrorResponse, UpdateUserFormData>({
        mutationFn: (updateUserPayload: UpdateUserFormData) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in to update your profile. Session expired or user deleted. Please try again.');
                return Promise.resolve(null);
            }
            return updateProfile(updateUserPayload, resolvedToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['me']
            });
            handleShowNotification('Profile successfully updated.');
            navigate(HOME);
        },
        onError: (error) => {
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
            else {
                handleShowNotification('Failed to update profile.');
            }
        }
    });

    return { mutation: updateProfileMutation };
};
