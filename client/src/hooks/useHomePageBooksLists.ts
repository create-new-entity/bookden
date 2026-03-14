import { useQuery } from '@tanstack/react-query';

import { getHomePageBookLists } from '../api';
import type { HomepageBookLists } from '../types';

const BOOK_LISTS_STALE_TIME = 1000 * 60 * 60; // 1 hour

export const useHomePageBookLists = () => {
    return useQuery<HomepageBookLists>({
        queryKey: ['homepageBookLists'],
        queryFn: getHomePageBookLists,
        staleTime: BOOK_LISTS_STALE_TIME
    });
};
