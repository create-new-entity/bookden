import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { restoreBook } from '../api';
import type { AxiosErrorResponse } from '../types';
import { useAuthContext, useNotificationContext } from '../contexts';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';


export const useRestoreBook = () => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();
    
    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const restoreBookMutation = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to restore a book. Session expired or user deleted. Please try again.');
                return Promise.resolve();
            }
            return restoreBook(bookId, resolvedToken);
        },
        onSuccess: (_, bookId) => {
            queryClient.invalidateQueries({ queryKey: ['booksList'] });
            queryClient.invalidateQueries({ queryKey: ['book', bookId] });
            handleShowNotification('Book restored successfully. Cover pick will not be restored.');
        },
        onError: (error) => {
            handleShowNotification('Failed to restore book.');
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    return {
        restoreBookMutation
    };
};