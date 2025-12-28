import { useQuery } from '@tanstack/react-query';

import { getTags } from '../api';
import type { BookTag } from '../types';


const useBookTags = () => {

    const { data, isLoading, isSuccess, isError } = useQuery<BookTag[], Error>({
        queryKey: ['bookTags'],
        queryFn: getTags
    });

    if(isLoading || isError) {
        return {
            data: [],
            isLoading,
            isSuccess,
            isError
        };
    }

    return {
        data,
        isLoading,
        isSuccess,
        isError
    };
};

export default useBookTags;