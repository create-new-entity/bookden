
import { useMutation, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { deleteAvatar, getAvatar } from '../api/avatar.ts';
import useAuthContext from '../contexts/AuthContext.tsx';
import { useEffect } from 'react';
import useAvatarContext from '../contexts/AvatarContext.tsx';
import type { AxiosErrorResponse } from '../types/UtilTypes.ts';
import { PLACE_HOLDER_AVATAR } from '../constants/utilConstants.ts';

const useAvatar = () => {

    const { token } = useAuthContext();
    const { setAvatarUrl } = useAvatarContext();

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
            setAvatarUrl(PLACE_HOLDER_AVATAR);
        },
        onError: (err) => {
            console.error('Avatar deletion failed.', err);
        },
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

    return { getAvatarResult, deleteAvatarMutation };
};

export default useAvatar;