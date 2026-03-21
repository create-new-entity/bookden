import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    const queryClient = useQueryClient();

    const objectUrl = useMemo(() => {
        const noValidBlobImage = blobResult.isError || !blobResult.data;
        if (noValidBlobImage) {
            return undefined;
        }
        return URL.createObjectURL(blobResult.data);
    }, [blobResult.data, blobResult.isError]);

    useEffect(() => {
        return () => {

            /*
                Note to future self:

                Why check for isStillInUse?
                Because we don't want to revoke the object url if the query is still in use.
                If the query is still in use, the object url is still valid.
                If we revoke early -> loads of warning logs in the console about "GET blob:... failed" -> refetch.
            */
            const state = queryClient.getQueryState(queryKey);
            const isStillInUse = state?.data !== undefined;
            if (!isStillInUse && objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl, queryClient, queryKey]);

    return {
        objectUrl,
        isLoading: blobResult.isLoading,
        isError: blobResult.isError,
        error: blobResult.error
    };
};
