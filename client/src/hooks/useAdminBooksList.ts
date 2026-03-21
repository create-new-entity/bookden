



import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type {
    BookSearchParams, BookSearchParamsWithTagsArray
} from '../validations';
import type {
    Book, BooksPriceRangeMeta, PaginatedDataList
} from '../types';
import { useBookManagementDeepLinking } from './useBookManagementDeepLinking';
import { useBooksFiltersMeta } from './useBooksFilterMeta';
import { useAuthContext, useNotificationContext } from '../contexts';
import { getAdminBooksList } from '../api';
import { AUTH } from '../constants';


type UseBooksListReturn = {
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>) => void;
    priceRangeMeta: BooksPriceRangeMeta | undefined;
};

export const useAdminBooksList = (): UseBooksListReturn => {
    const { params: originalParams, updateParams } = useBookManagementDeepLinking();
    const { data: priceRangeMeta } = useBooksFiltersMeta();
    const { token, hasExistingLoggedInUser } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();
    const navigate = useNavigate();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const resolvedToken = token || existingLoggedInData?.token;

    const params = {
        ...originalParams,
        tags: originalParams.tags.split(',').filter((tag) => tag !== '')
    };
    const { search, page, sortBy, sortOrder, tags, priceMin, priceMax } = params;


    const tagsString = tags.join(',');

    const booksList = useQuery({
        queryKey: ['booksList', search, page, sortBy, sortOrder, tagsString, priceMin, priceMax],
        queryFn: () => {
            if(!resolvedToken) {
                navigate(AUTH);
                handleShowNotification('You need to be logged in as an admin or superadmin to get the books list. Session expired or user deleted. Please try again.');
                return Promise.resolve({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } });
            }
            return getAdminBooksList({ search, page, sortBy, sortOrder, tags: tagsString, priceMin, priceMax }, resolvedToken);
        }
    });
    
    return { booksList, params, updateParams, priceRangeMeta };
};
