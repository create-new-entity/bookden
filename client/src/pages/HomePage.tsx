import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';

const HomePage = () => {
    const { isLoggedIn, handleLoggedOutContext } = useAuthContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/auth');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            Hello there and welcome!
            <button onClick={handleLoggedOutContext}>Log Out</button>
        </div>
    );
};

export default HomePage;