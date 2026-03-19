


import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getAdminBook } from '../../api';
import type { AxiosErrorResponse, Book } from '../../types';
import { useAuthContext } from '../../contexts';
import { NOT_FOUND } from '../../constants';
import { AUTH } from '../../constants';
import { useNotificationContext } from '../../contexts';

export type UseAdminBookHook = (bookId: number) => UseQueryResult<Book, AxiosErrorResponse>;

export const useAdminBook: UseAdminBookHook = (bookId) => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    
    const bookQuery = useQuery<Book, AxiosErrorResponse>({
        queryKey: ['book', bookId],
        queryFn: () => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to get a book. Session expired or user deleted. Please try again.');
                return Promise.resolve({});
            }
            return getAdminBook(bookId, resolvedToken);
        },
        enabled: bookId >= 0,
        retry: false
    });

    useEffect(() => {
        if (bookQuery.error?.response?.status === 404) {
            navigate(NOT_FOUND, { replace: true });
        }
    }, [bookQuery.error, navigate]);

    return bookQuery;
};
