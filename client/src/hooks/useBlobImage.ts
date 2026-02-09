import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useState } from 'react';



/* 
    Note to future self:
    useBlobImage loads image of user avatar, book cover and so on from the server.
    We pass the query key and query function to the hook.
    Hook returns the object url of the image.
*/

type UseBlobImageOptions = {
    queryKey: readonly unknown[];
    queryFn: () => Promise<Blob>;
    enabled?: boolean;
};

export type UseBlobImageReturn = {
    objectUrl: string | undefined;
    isLoading: boolean;
    isError: boolean;
    error: AxiosError | null;
};

export const useBlobImage = ({ queryKey, queryFn, enabled = true }: UseBlobImageOptions): UseBlobImageReturn => {
    const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
    const blobResult = useQuery<Blob, AxiosError>({
        queryKey, queryFn, enabled, retry: false
    });

    useEffect(() => {
        const noValidBlobImage = blobResult.isError || !blobResult.data;
        if (noValidBlobImage) {
            setObjectUrl(undefined);
            return;
        }
        
        const url = URL.createObjectURL(blobResult.data);
        setObjectUrl(url);
        
        return () => {
            if(url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [blobResult.data, blobResult.isError]);


    return {
        objectUrl,
        isLoading: blobResult.isLoading,
        isError: blobResult.isError,
        error: blobResult.error
    };
};
