import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getUserAvatarBlob } from '../api';
import { useAuthContext } from '../contexts';
import { useEffect, useState } from 'react';


const useAvatarBlob = (userId: number) => {
    const { token } = useAuthContext();
    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
    const userAvatarBlobResult = useQuery<Blob, AxiosError>({
        queryKey: ['avatar', token, userId],
        queryFn: () => getUserAvatarBlob(token, userId),
        enabled: !!token && !!userId,
        retry: false
    });

    useEffect(() => {
        const blob = userAvatarBlobResult.data;
        if(!blob) {
            return;
        }
        const url = URL.createObjectURL(blob);
        setObjectUrl(url);
        
        return () => {
            if(url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [userAvatarBlobResult.data]);


    return {
        objectUrl,
        isLoading: userAvatarBlobResult.isLoading,
        isError: userAvatarBlobResult.isError,
        error: userAvatarBlobResult.error
    };
};

export default useAvatarBlob;