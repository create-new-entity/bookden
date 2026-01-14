
import { BookSearchParamsSchema } from '../validations';
import { useDeepLinkedSearchParams } from './useDeepLinkedSearchParams';


export const useBookManagementDeepLinking = () => {
    return useDeepLinkedSearchParams(BookSearchParamsSchema);
};

