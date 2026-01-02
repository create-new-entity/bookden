import { useQuery } from '@tanstack/react-query';

import { getBook } from '../api/books';
import type { AxiosErrorResponse, Book } from '../types';
import { useAuthContext } from '../contexts';


const useBook = (bookId: number) => {
    const { token } = useAuthContext();
    
    const bookQuery = useQuery<Book, AxiosErrorResponse>({
        queryKey: ['book', bookId],
        queryFn: () => getBook(bookId, token),
        enabled: !!bookId
    });

    return bookQuery;
};

export default useBook;