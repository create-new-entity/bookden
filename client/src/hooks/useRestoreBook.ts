import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restoreBook } from '../api';
import type { AxiosErrorResponse } from '../types';
import { useAuthContext, useNotificationContext } from '../contexts';


export const useRestoreBook = (bookId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const restoreBookMutation = useMutation<void, AxiosErrorResponse>({
        mutationFn: () => restoreBook(bookId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            handleShowNotification('Book restored successfully. Cover pick will not be restored.');
        },
        onError: () => {
            handleShowNotification('Failed to restore book.');
        }
    });

    return {
        restoreBookMutation
    };
};