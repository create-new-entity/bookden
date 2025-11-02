import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { BOOKDEN_TOKEN } from '../constants';

const HomePage = () => {
    const { handleLoggedOutContext, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!localStorage.getItem(BOOKDEN_TOKEN) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    return (
        <div style={{ marginTop: 300 }}>
            Hello there and welcome!
            <button onClick={handleLoggedOutContext}>Log Out</button>
        </div>
    );
};

export default HomePage;