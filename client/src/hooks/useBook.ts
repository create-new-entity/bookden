import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getBook } from '../api';
import type { AxiosErrorResponse, Book } from '../types';
import { useAuthContext } from '../contexts';
import { NOT_FOUND } from '../constants';


export const useBook = (bookId: number) => {
    const { token } = useAuthContext();
    const navigate = useNavigate();
    const bookQuery = useQuery<Book, AxiosErrorResponse>({
        queryKey: ['book', bookId],
        queryFn: () => getBook(bookId, token),
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
