import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteBook, deleteBookCover } from '../api';
import type { AxiosErrorResponse } from '../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';
import { useNavigate } from 'react-router-dom';



export const useDeleteBook = () => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const deleteBookMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to delete a book. Session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return deleteBook(bookId, resolvedToken);
        },
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ['booksList'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            handleShowNotification('Book deleted successfully.');
        },
        onError: (error) => {
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    const deleteBookCoverMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to delete a book cover. Session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return deleteBookCover(bookId, resolvedToken);
        },
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ['bookCover', bookId] });
        },
        onError: (error) => {
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
            else {
                handleShowNotification('Failed to delete book cover.');
            }
        }
    });

    const deleteBookCoverAndBookData = (bookId: number) => {
        deleteBookMutation.mutate(bookId);
        deleteBookCoverMutation.mutate(bookId);
    };
    
    return {
        deleteBookCoverAndBookData
    };
};
