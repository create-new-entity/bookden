
import { UserSearchParamsSchema } from '../validations';
import { useDeepLinkedSearchParams } from './useDeepLinkedSearchParams';


export default function useUserManagementDeepLinking() {
    return useDeepLinkedSearchParams(UserSearchParamsSchema);
};
