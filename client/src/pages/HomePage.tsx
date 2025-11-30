import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { LOGGED_IN_USER_DATA } from '../constants';
import { useAuthContext } from '../contexts';
import { useSetTabTitle } from '../hooks';

const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem(LOGGED_IN_USER_DATA) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    useSetTabTitle('Home');

    return (
        <>
            <div>Test</div>
        </>
    );
};

export default HomePage;