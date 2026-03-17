import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useMemo } from 'react';



/* 
    Note to future self:
    useBlobImage loads image of user avatar, book cover and so on from the server.
    We pass the query key and query function to the hook.
    Hook returns the object url of the image.

    We derive objectUrl from query data (useMemo) instead of setState in useEffect
    to avoid "Maximum update depth exceeded" when many instances run simultaneously.
    See: https://github.com/TanStack/query/issues/7264
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
    const blobResult = useQuery<Blob, AxiosError>({
        queryKey, queryFn, enabled, retry: false
    });

    const objectUrl = useMemo(() => {
        const noValidBlobImage = blobResult.isError || !blobResult.data;
        if (noValidBlobImage) {
            return undefined;
        }
        return URL.createObjectURL(blobResult.data);
    }, [blobResult.data, blobResult.isError]);

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    return {
        objectUrl,
        isLoading: blobResult.isLoading,
        isError: blobResult.isError,
        error: blobResult.error
    };
};
