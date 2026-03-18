import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

import type { AxiosErrorResponse } from '../types';
import type { CreateUpdateBookData } from '../validations';
import { updateBook } from '../api';
import { useAuthContext, useNotificationContext } from '../contexts';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';


const useUpdateBook = (bookId: number) => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const updateBookMutation = useMutation<AxiosResponse, AxiosErrorResponse, CreateUpdateBookData>({
        mutationFn: (data: CreateUpdateBookData) => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to update a book. Session expired or user deleted. Please try again.');
                return Promise.resolve({});
            }
            return updateBook(bookId, data, resolvedToken);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['book', bookId]
            });
            handleShowNotification('Book updated successfully.');
        },
        onError: (error: AxiosErrorResponse) => {
            handleShowNotification(error.response?.data.message || 'An error occurred while updating the book.');
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    return { updateBookMutation };
};

export default useUpdateBook;

