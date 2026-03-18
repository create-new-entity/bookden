

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type {
    BookSearchParams, BookSearchParamsWithTagsArray
} from '../validations';
import type {
    Book, BooksPriceRangeMeta, PaginatedDataList
} from '../types';
import { useBookManagementDeepLinking } from './useBookManagementDeepLinking';
import { getPublicBooksList } from '../api';
import { useBooksFiltersMeta } from './useBooksFilterMeta';


type UseBooksListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>) => void;
    priceRangeMeta: BooksPriceRangeMeta | undefined;
};

export const usePublicBooksList = (): UseBooksListReturn => {
    const { params: originalParams, updateParams } = useBookManagementDeepLinking();
    const { data: priceRangeMeta } = useBooksFiltersMeta();


    const params = {
        ...originalParams,
        tags: originalParams.tags.split(',').filter((tag) => tag !== '')
    };
    const { search, page, sortBy, sortOrder, tags, priceMin, priceMax } = params;

    const tagsString = tags.join(',');
    const booksList = useQuery({
        queryKey: ['booksList', search, page, sortBy, sortOrder, tagsString, priceMin, priceMax],
        queryFn: () => getPublicBooksList({ search, page, sortBy, sortOrder, tags: tagsString, priceMin, priceMax })
    });
    
    return { booksList, params, updateParams, priceRangeMeta };
};
