import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import { deleteBook, deleteBookCover } from '../api';
import type { AxiosErrorResponse } from '../types';



export const useDeleteBook = () => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const deleteBookMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => deleteBook(bookId, token),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ['booksList'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            handleShowNotification('Book deleted successfully.');
        }
    });

    const deleteBookCoverMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => deleteBookCover(bookId, token),
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ['bookCover', bookId] });
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
