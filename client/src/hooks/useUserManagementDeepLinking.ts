
import { UserSearchParamsSchema } from '../validations';
import { useDeepLinkedSearchParams } from './useDeepLinkedSearchParams';


export const useUserManagementDeepLinking = () => {
    return useDeepLinkedSearchParams(UserSearchParamsSchema);
};
