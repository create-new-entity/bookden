

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { BookSearchParams } from '../validations';
import type { Book, PaginatedDataList } from '../types';
import useBookManagementDeepLinking from './useBookManagementDeepLinking';
import { useAuthContext } from '../contexts';
import { getBooksList } from '../api';


export type UseBooksListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: Omit<BookSearchParams, 'tags'> & { tags: string[] };
    updateParams: (params: Partial<BookSearchParams>) => void;
};

const useBooksList = () => {
    const { token } = useAuthContext();
    const { params: originalParams, updateParams } = useBookManagementDeepLinking();

    const params = {
        ...originalParams,
        tags: originalParams.tags.split(',').filter((tag) => tag !== '')
    };
    const { search, page, sortBy, sortOrder, tags } = params;

    const booksList = useQuery({
        queryKey: ['booksList', search, page, sortBy, sortOrder, tags, token],
        queryFn: () => getBooksList({ search, page, sortBy, sortOrder, tags }, token)
    });
    
    return { booksList, params, updateParams };
};

export default useBooksList;