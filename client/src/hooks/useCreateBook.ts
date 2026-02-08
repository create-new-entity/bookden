


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';

import type { CreateUpdateBookData } from '../validations';
import { useAuthContext, useNotificationContext } from '../contexts';
import { addBook } from '../api';
import type { AxiosErrorResponse } from '../types';
import { AUTH, BOOK_MANAGEMENT, UNAUTHORIZED_STATUS_CODE } from '../constants';


type CreateBookArgs = {
  data: CreateUpdateBookData;
  coverImage: File;
};

export const useCreateBook = () => {
    const { token } = useAuthContext();
    const queryClient = useQueryClient();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const createBookMutation = useMutation<AxiosResponse, AxiosErrorResponse, CreateBookArgs>({
        mutationFn: (args: CreateBookArgs) => {
            return addBook(args, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            handleShowNotification('Book created successfully.');
            navigate(BOOK_MANAGEMENT);
        },
        onError: (error) => {
            handleShowNotification(error.response?.data?.message ?? 'Something went wrong');
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    return { createBookMutation };
};

