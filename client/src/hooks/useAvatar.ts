
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAvatarContext, useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';
import { addOrUpdate, deleteAvatar, getAvatar } from '../api';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';

export const useAvatar = () => {

    const { token } = useAuthContext();
    const { avatarUrl, setAvatarUrl } = useAvatarContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const getAvatarResult = useQuery<Blob, AxiosError>({
        queryKey: ['avatar', token],
        queryFn: async () => {
            const avatarBlobData = await getAvatar(token);
            return avatarBlobData;
        },
        retry: false,
        enabled: !!token, // Don't run without token.
    });

    const deleteAvatarMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => deleteAvatar(token),
        onSuccess: () => {
            setAvatarUrl(() => {
                if(avatarUrl) {
                    URL.revokeObjectURL(avatarUrl);
                }
                return null;
            });
            queryClient.invalidateQueries({ queryKey: ['avatar', token] });
        },
        onError: (err) => {
            console.error('Avatar deletion failed.', err);
        },
    });

    const addOrUpdateAvatarMutation = useMutation<void, AxiosErrorResponse, File>({
        mutationFn: (newAvatar: File) => addOrUpdate(newAvatar, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avatar', token] });
        },
        onError: (err) => {
            const message = `${err.response?.data.message}. Image size should be smaller than 2MB.`;
            handleShowNotification(message);
            if(err.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    useEffect(() => {
        let avatarObjectUrl: string;

        if(getAvatarResult.isSuccess) {
            avatarObjectUrl = URL.createObjectURL(getAvatarResult.data);
            setAvatarUrl(avatarObjectUrl);
        }
        if(getAvatarResult.isError) {
            console.log('Avatar is not found!');
        }

        return () => {
            if(avatarObjectUrl) {
                URL.revokeObjectURL(avatarObjectUrl);
            } 
        };

    }, [getAvatarResult.isSuccess, getAvatarResult.isError, getAvatarResult.data, setAvatarUrl]);

    return { getAvatarResult, deleteAvatarMutation, addOrUpdateAvatarMutation };
};