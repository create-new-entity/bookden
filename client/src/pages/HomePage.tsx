import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { LOGGED_IN_USER_DATA } from '../constants';
import { useAuthContext } from '../contexts';
import { CustomAutoComplete } from '../components';
import { Autocomplete, TextField } from '@mui/material';


const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem(LOGGED_IN_USER_DATA) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    useEffect(() => {
        document.title = 'Home';
    }, []);

    return (
        <>
            <div>Test</div>
        </>
    );
};

export default HomePage;