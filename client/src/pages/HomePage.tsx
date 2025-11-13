import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { LOGGED_IN_USER_DATA } from '../constants';
import { useAuthContext } from '../contexts';


const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem(LOGGED_IN_USER_DATA) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    return (
        <div>
            Hello there and welcome!
        </div>
    );
};

export default HomePage;