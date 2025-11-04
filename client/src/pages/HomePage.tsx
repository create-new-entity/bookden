import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { BOOKDEN_TOKEN } from '../constants';
import ThemeSwitch from '../components/ThemeSwitch';

const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem(BOOKDEN_TOKEN) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    return (
        <div style={{ paddingTop: 200 }}>
            Hello there and welcome!
        </div>
    );
};

export default HomePage;