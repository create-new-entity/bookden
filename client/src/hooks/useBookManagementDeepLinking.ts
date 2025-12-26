
import { BookSearchParamsSchema } from '../validations';
import { useDeepLinkedSearchParams } from './useDeepLinkedSearchParams';


export default function useBookManagementDeepLinking() {
    return useDeepLinkedSearchParams(BookSearchParamsSchema);
};
