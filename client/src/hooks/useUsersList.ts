import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { CREATED_AT, DESC } from '../constants';
import { getUsersList } from '../api';
import { useAuthContext } from '../contexts';


const useUsersList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState(CREATED_AT);
    const [sortOrder, setSortOrder] = useState(DESC);
    const [userType, setUserType] = useState('admin');
    const { token } = useAuthContext();

    const queryFn = () => {
        return getUsersList({ search, page, sortBy, sortOrder, userType }, token);
    };

    const usersList = useQuery({
        queryKey: ['usersList', search, page, sortBy, sortOrder, userType],
        queryFn
    });
    
    return {
        usersList,
        search, setSearch,
        page, setPage,
        sortBy, setSortBy,
        sortOrder, setSortOrder,
        userType, setUserType,
    };
};

export default useUsersList;