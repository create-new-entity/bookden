

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type {
    BookSearchParams, BookSearchParamsWithTagsArray
} from '../validations';
import type {
    Book, BooksPriceRangeMeta, PaginatedDataList
} from '../types';
import { useBookManagementDeepLinking } from './useBookManagementDeepLinking';
import { useAuthContext } from '../contexts';
import { getWishlistedBooks } from '../api';
import { useBooksFiltersMeta } from './useBooksFilterMeta';


type UseBooksWishListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>) => void;
    priceRangeMeta: BooksPriceRangeMeta | undefined;
    isWishlisted: (bookId: number) => boolean;
};

export const useBooksWishList = (): UseBooksWishListReturn => {
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { params: originalParams, updateParams } = useBookManagementDeepLinking();
    const { data: priceRangeMeta } = useBooksFiltersMeta();
    const existingLoggedInUser = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInUser.existingLoggedInData?.token;

    const params = {
        ...originalParams,
        tags: originalParams.tags.split(',').filter((tag) => tag !== '')
    };
    const { search, page, sortBy, sortOrder, tags, priceMin, priceMax } = params;

    const tagsString = tags.join(',');
    const booksList = useQuery({
        queryKey: ['wishlistedBooks', search, page, sortBy, sortOrder, tagsString, priceMin, priceMax],
        queryFn: () => getWishlistedBooks({ search, page, sortBy, sortOrder, tags: tagsString, priceMin, priceMax }, resolvedToken || '')
    });

    const isWishlisted = (bookId: number) => {
        return booksList.data?.data.some((book) => book.bookId === bookId) || false;
    };
    
    return { booksList, params, updateParams, priceRangeMeta, isWishlisted };
};
