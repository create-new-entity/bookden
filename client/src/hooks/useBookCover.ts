import {
    useMutation, useQueryClient, type UseMutationResult
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import { getBookCover, updateBookCover } from '../api/books';
import { useBlobImage, type UseBlobImageReturn } from './useBlobImage';
import { useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';


type UseBookCoverReturn = {
    bookCoverBlob: UseBlobImageReturn;
    updateBookCoverMutation: UseMutationResult<AxiosResponse, AxiosErrorResponse, File>;
};

export const useBookCover = (bookId: number): UseBookCoverReturn => {
    const { handleShowNotification } = useNotificationContext();
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => getBookCover(bookId),
        enabled: !!bookId,
    };

    const updateBookCoverMutation = useMutation({
        mutationFn: (coverImage: File) => updateBookCover(bookId, coverImage, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookCover', bookId] });
        },
        onError: (error: AxiosErrorResponse) => {
            handleShowNotification(error.response?.data.message || 'An error occurred while updating the book cover.');
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        },
    });


    
    return {
        bookCoverBlob: useBlobImage(blobOptions),
        updateBookCoverMutation
    };
};
