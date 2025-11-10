
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getAvatar } from '../api/avatar.ts';
import useAuthContext from '../contexts/AuthContext.tsx';
import { useEffect } from 'react';
import useAvatarContext from '../contexts/AvatarContext.tsx';

const useAvatar = () => {

    const { token } = useAuthContext();
    const { setAvatarUrl } = useAvatarContext();

    const getAvatarResult = useQuery<Blob, AxiosError>({
        queryKey: ['avatar', token],
        queryFn: async () => {
            const avatarBlobData = await getAvatar(token);
            return avatarBlobData;
        },
        enabled: !!token, // Don't run without token.
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

    return { getAvatarResult };
};

export default useAvatar;