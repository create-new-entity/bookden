import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteBook, deleteBookCover } from '../api';
import type { AxiosErrorResponse } from '../types';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';
import { useNavigate } from 'react-router-dom';



export const useDeleteBook = () => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const deleteBookMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => deleteBook(bookId, token),
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
        mutationFn: (bookId: number) => deleteBookCover(bookId, token),
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
