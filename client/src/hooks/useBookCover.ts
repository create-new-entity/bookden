import {
    useMutation, useQueryClient, type UseMutationResult
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import { getBookCover, updateBookCover } from '../api/books';
import { useBlobImage, type UseBlobImageReturn } from './useBlobImage';
import { useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';


type UseBookCoverReturn = {
    bookCoverBlob: UseBlobImageReturn;
    updateBookCoverMutation: UseMutationResult<AxiosResponse, AxiosErrorResponse, File>;
};

export const useBookCover = (bookId: number): UseBookCoverReturn => {
    const { handleShowNotification } = useNotificationContext();
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    
    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => getBookCover(bookId),
        enabled: !!bookId,
    };

    const updateBookCoverMutation = useMutation({
        mutationFn: (coverImage: File) => updateBookCover(bookId, coverImage, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookCover', bookId] });
            handleShowNotification('Book cover updated successfully.');
        },
        onError: (error: AxiosErrorResponse) => {
            handleShowNotification(error.response?.data.message || 'An error occurred while updating the book cover.');
        },
    });


    
    return {
        bookCoverBlob: useBlobImage(blobOptions),
        updateBookCoverMutation
    };
};
