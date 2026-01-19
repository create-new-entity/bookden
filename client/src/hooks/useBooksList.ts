

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { BookSearchParams, BookSearchParamsWithTagsArray } from '../validations';
import type { Book, BooksPriceRangeMeta, PaginatedDataList } from '../types';
import { useBookManagementDeepLinking } from './useBookManagementDeepLinking';
import { useAuthContext } from '../contexts';
import { getBooksList } from '../api';
import { useBooksFiltersMeta } from './useBooksFilterMeta';


type UseBooksListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>) => void;
    priceRangeMeta: BooksPriceRangeMeta | undefined;
};

export const useBooksList = (): UseBooksListReturn => {
    const { token } = useAuthContext();
    const { params: originalParams, updateParams } = useBookManagementDeepLinking();
    const { data: priceRangeMeta } = useBooksFiltersMeta();

    const params = {
        ...originalParams,
        tags: originalParams.tags.split(',').filter((tag) => tag !== '')
    };
    const { search, page, sortBy, sortOrder, tags, priceMin, priceMax } = params;

    const booksList = useQuery({
        queryKey: ['booksList', search, page, sortBy, sortOrder, tags, priceMin, priceMax, token],
        queryFn: () => getBooksList({ search, page, sortBy, sortOrder, tags: tags.join(','), priceMin, priceMax }, token)
    });
    
    return { booksList, params, updateParams, priceRangeMeta };
};
