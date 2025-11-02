import { Routes, Route, useLocation } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import NavDrawer from './components/NavDrawer';
import useAuthContext from './contexts/AuthContext';
import useNavContext from './contexts/NavContext';
import { useEffect } from 'react';

const App = () => {
    const { handleLoggedOutContext } = useAuthContext();
    const { options, setOptions, setShowNavDrawer } = useNavContext();
    const location = useLocation();

    useEffect(() => {
        const newOptions = options.map(o => {
            if(o.name === 'logout') {
                return {
                    ...o,
                    action: () => {
                        setShowNavDrawer(false);
                        handleLoggedOutContext();
                    }
                };
            }
            return o;
        });
        setOptions(newOptions);
    }, []);

    const isLoginPage = location.pathname === '/auth';

    return (
        <>
            <Routes>
                <Route path="/auth" element={<LogInPage/>} />
                <Route path="/" element={<HomePage/>} />
            </Routes>
            {
                !isLoginPage &&
                <>
                    <NavBar/>
                    <NavDrawer/>
                </>
            }
        </>
    );
};

export default App;
