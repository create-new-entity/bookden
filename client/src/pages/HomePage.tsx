import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { BOOKDEN_TOKEN } from '../constants';
import useThemeModeContext from '../contexts/ThemeModeContext';

const HomePage = () => {
    const { handleLoggedOutContext, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    const { switchMode } = useThemeModeContext();
    
    useEffect(() => {
        if(!localStorage.getItem(BOOKDEN_TOKEN) && !isLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, isLoggedIn]);

    return (
        <div style={{ paddingTop: 200 }}>
            Hello there and welcome!
            <button onClick={handleLoggedOutContext}>Log Out</button>
            <button onClick={switchMode}>Switch mode</button>
        </div>
    );
};

export default HomePage;