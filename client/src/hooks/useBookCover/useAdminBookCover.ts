

import {
    useMutation, useQueryClient, type UseMutationResult
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import { getAdminBookCover, updateBookCover } from '../../api/books';
import { useBlobImage, type UseBlobImageReturn } from '../useBlobImage';
import { useAuthContext, useNotificationContext } from '../../contexts';
import type { AxiosErrorResponse } from '../../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../../constants';


export type UseAdminBookCoverReturn = {
    bookCoverBlob: UseBlobImageReturn;
    updateBookCoverMutation: UseMutationResult<AxiosResponse, AxiosErrorResponse, File>;
};

export type UseAdminBookCoverHook = (bookId: number) => UseAdminBookCoverReturn;

export const useAdminBookCover: UseAdminBookCoverHook = (bookId) => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;
    
    const blobOptions = {
        queryKey: ['bookCover', bookId],
        queryFn: () => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('Session expired or user deleted. Please try again.');
                return Promise.resolve({});
            }
            return getAdminBookCover(bookId, resolvedToken);
        },
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
