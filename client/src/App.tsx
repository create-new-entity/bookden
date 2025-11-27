import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { AdminToolsPage, HomePage, LogInPage, ProfilePage, UserManagementPage } from './pages';
import { useAuthContext, useNavContext, useNotificationContext } from './contexts';
import { NavBar, NavDrawer } from './components';
import { Snackbar } from '@mui/material';
import { NOTIFICATION_DELAY } from './constants';
import { ADMIN_TOOLS, AUTH, HOME, PROFILE, USER_MANAGEMENT } from './constants/routes';

const App = () => {
    const { clearAuthentication } = useAuthContext();
    const { setOptions, setShowNavDrawer } = useNavContext();
    const location = useLocation();
    // console.log('location', location);
    const { open, onClose, message, anchorOrigin } = useNotificationContext();

    useEffect(() => {
        setOptions((prevOptions) => {
            const newOptions = prevOptions.map(o => {
                if(o.name === 'logout') {
                    return {
                        ...o,
                        action: () => {
                            setShowNavDrawer(false);
                            clearAuthentication();
                        }
                    };
                }
                return o;
            });
            return newOptions;
        });
    }, [setOptions, setShowNavDrawer, clearAuthentication]);

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
                <Route path={AUTH} element={<LogInPage/>} />
                <Route path={PROFILE} element={<ProfilePage/>}/>
                <Route path={USER_MANAGEMENT} element={<UserManagementPage/>} />
                <Route path={ADMIN_TOOLS} element={<AdminToolsPage/>} />
                <Route path={HOME} element={<HomePage/>} />
            </Routes>
            <Snackbar
                autoHideDuration={NOTIFICATION_DELAY}
                anchorOrigin={anchorOrigin}
                open={open}
                onClose={onClose}
                message={message}
                key={anchorOrigin.horizontal + anchorOrigin.vertical}
            />
        </>
    );
};

export default App;
