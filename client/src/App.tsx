import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { HomePage, LogInPage, ProfilePage } from './pages';
import { useAuthContext, useNavContext } from './contexts';
import { NavBar, NavDrawer } from './components';

const App = () => {
    const { handleLoggedOutContext } = useAuthContext();
    const { setOptions, setShowNavDrawer } = useNavContext();
    const location = useLocation();

    useEffect(() => {
        setOptions((prevOptions) => {
            const newOptions = prevOptions.map(o => {
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
            return newOptions;
        });
    }, [setOptions, setShowNavDrawer, handleLoggedOutContext]);

    const isLoginPage = location.pathname === '/auth';

    return (
        <>
            {
                !isLoginPage &&
                <>
                    <NavBar/>
                    <NavDrawer/>
                </>
            }
            <Routes>
                <Route path="/auth" element={<LogInPage/>} />
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/" element={<HomePage/>} />
            </Routes>
        </>
    );
};

export default App;
