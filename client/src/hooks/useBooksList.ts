

import { type UseQueryResult } from '@tanstack/react-query';

// import { getBooksList } from '../api';
// import { useAuthContext } from '../contexts';
import type { BookSearchParams } from '../validations';
import type { Book, PaginatedDataList } from '../types';
import useBookManagementDeepLinking from './useBookManagementDeepLinking';


export type UseBooksListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParams;
    updateParams: (params: Partial<BookSearchParams>) => void;
};

const useBooksList = () => {
    // const { token } = useAuthContext();
    const { params, updateParams } = useBookManagementDeepLinking();

    console.log('books params', params);

    // const { search, page, sortBy, sortOrder, tags } = params;

    // const queryFn = () => {
    //     console.log('Call query fn with params:', { search, page, sortBy, sortOrder, tags });
    // };

    // const booksList = useQuery({
    //     queryKey: ['booksList', search, page, sortBy, sortOrder, tags, token],
    //     queryFn
    // });
    
    return { booksList: { data: [], pagination: { total: 0, page: 1, limit: 10 } }, params, updateParams };
};

export default useBooksList;