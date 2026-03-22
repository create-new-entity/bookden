import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthContext, useNotificationContext } from '../contexts';
import type { AxiosErrorResponse } from '../types';
import { addBookToWishList, removeBookFromWishlist } from '../api';
import { useNavigate } from 'react-router-dom';
import { AUTH, UNAUTHORIZED_STATUS_CODE } from '../constants';


export const useBooksWishListMutation = () => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;
    
    const addToWishList = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => {
            if(!resolvedToken) {
                handleShowNotification('You need to be logged in with customer account to add books to your wishlist.');
                navigate(AUTH);
                return Promise.reject(new Error('User not logged in'));
            }
            return addBookToWishList(bookId, token);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['wishlistedBooks']
            });
            queryClient.invalidateQueries({
                queryKey: ['booksList']
            });
        },

        onError: (error) => {
            if(error.response?.status === UNAUTHORIZED_STATUS_CODE) {
                handleShowNotification('Session expired or user deleted. Please log in again.');
                navigate(AUTH);
            }
        }
    });

    const removeFromWishList = useMutation<void, AxiosErrorResponse, number>({
        mutationFn: (bookId: number) => {
            return removeBookFromWishlist(bookId, token);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['wishlistedBooks']
            });
            queryClient.invalidateQueries({
                queryKey: ['booksList']
            });
        }
    });

    return { addToWishList, removeFromWishList };
};