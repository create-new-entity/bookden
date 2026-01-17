import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteBook, deleteBookCover } from '../api';
import type { AxiosErrorResponse } from '../types';



export const useDeleteBook = (bookId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const deleteBookMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => deleteBook(bookId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            handleShowNotification('Book deleted successfully.');
        }
    });

    const deleteBookCoverMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => deleteBookCover(bookId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookCover', bookId] });
        }
    });

    const deleteBookCoverAndBookData = () => {
        deleteBookMutation.mutate();
        deleteBookCoverMutation.mutate();
    };
    
    return {
        deleteBookCoverAndBookData
    };
};
