import { useQuery } from '@tanstack/react-query';

import { getUsersList } from '../api';
import { useAuthContext } from '../contexts';
import type { SortByOptions, SortOrder, UserTypeOptions } from '../types';
import { useState } from 'react';
import { CREATED_AT, DESC } from '../constants';


const useUsersList = () => {
    const { token } = useAuthContext();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortByOptions>(CREATED_AT);
    const [sortOrder, setSortOrder] = useState<SortOrder>(DESC);
    const [userType, setUserType] = useState<UserTypeOptions>('all');

    const queryFn = () => {
        const userTypeQuery = userType === 'all' ? '' : userType;
        return getUsersList({ search, page, sortBy, sortOrder, userType: userTypeQuery }, token);
    };

    const usersList = useQuery({
        queryKey: ['usersList', search, page, sortBy, sortOrder, userType, token],
        queryFn
    });
    
    return { usersList, search, setSearch, page, setPage, sortBy, setSortBy, sortOrder, setSortOrder, userType, setUserType };
};

export default useUsersList;