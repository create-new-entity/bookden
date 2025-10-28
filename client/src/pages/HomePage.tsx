import { useNavigate } from 'react-router-dom';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';

const HomePage = () => {
    const { isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            Hello there and welcome!
        </div>
    );
};

export default HomePage;