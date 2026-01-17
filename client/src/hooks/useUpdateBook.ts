import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

import type { AxiosErrorResponse } from '../types';
import type { CreateUpdateBookData } from '../validations';
import { updateBook } from '../api';
import { useAuthContext, useNotificationContext } from '../contexts';


const useUpdateBook = (bookId: number) => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();

    const updateBookMutation = useMutation<AxiosResponse, AxiosErrorResponse, CreateUpdateBookData>({
        mutationFn: (data: CreateUpdateBookData) => {
            return updateBook(bookId, data, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['book', bookId]
            });
        },
        onError: (error: AxiosErrorResponse) => {
            handleShowNotification(error.response?.data.message || 'An error occurred while updating the book.');
        }
    });

    return { updateBookMutation };
};

export default useUpdateBook;

