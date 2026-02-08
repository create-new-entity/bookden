


import { useQuery } from '@tanstack/react-query';

import { getBooksFiltersMeta } from '../api/books';

export function useBooksFiltersMeta() {
    return useQuery({
        queryKey: ['books', 'filters', 'meta'],
        queryFn: getBooksFiltersMeta,

        /* 
           Duration of time after which the data is considered stale and needs to be refetched.
           Should be same as PRICE_RANGE_TTL_SECONDS in server/constants.ts.
        */
        staleTime: 60 * 10 * 1000 // 10 minutes
    });
}
