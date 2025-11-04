import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { LOGGED_IN_USER_DATA } from '../constants';


const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    useEffect(() => {
        if(!localStorage.getItem(LOGGED_IN_USER_DATA) && !isLoggedIn) {
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