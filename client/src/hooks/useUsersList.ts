import { useQuery } from '@tanstack/react-query';

import { getUsersList } from '../api';
import { useAuthContext } from '../contexts';
import useUsersListDeepLinking from './useUsersListDeepLinking';


const useUsersList = () => {
    const { token } = useAuthContext();
    const { params, updateParams } = useUsersListDeepLinking();

    const { search, page, sortBy, sortOrder, userType } = params;

    const queryFn = () => {
        const userTypeQuery = userType === 'all' ? '' : userType;
        return getUsersList({ search, page, sortBy, sortOrder, userType: userTypeQuery }, token);
    };

    const usersList = useQuery({
        queryKey: ['usersList', search, page, sortBy, sortOrder, userType, token],
        queryFn
    });
    
    return { usersList, params, updateParams };
};

export default useUsersList;