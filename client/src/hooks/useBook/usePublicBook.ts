

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { AxiosErrorResponse, Book } from '../../types';
import { NOT_FOUND } from '../../constants';
import { getPublicBook } from '../../api';

export type UsePublicBookHook = (bookId: number) => UseQueryResult<Book, AxiosErrorResponse>;

export const usePublicBook: UsePublicBookHook = (bookId) => {
    const navigate = useNavigate();
    const bookQuery = useQuery<Book, AxiosErrorResponse>({
        queryKey: ['book', bookId],
        queryFn: () => getPublicBook(bookId),
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
