import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Snackbar } from '@mui/material';

import {
    AdminToolsPage,
    CreateAdminOrUpdateAnyUserProfilePage,
    HomePage,
    LogInPage,
    UserManagementPage,
    UserPage
} from './pages';
import { useAuthContext, useNavContext, useNotificationContext } from './contexts';
import { NavBar, NavDrawer } from './components';
import {
    ADMIN_TOOLS,
    AUTH,
    CREATE_ADMIN_USER,
    HOME,
    UPDATE_PROFILE,
    USER,
    USER_MANAGEMENT,
    NOTIFICATION_DELAY
} from './constants';

const App = () => {
    const { clearAuthentication } = useAuthContext();
    const { setOptions, setShowNavDrawer } = useNavContext();
    const location = useLocation();
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
                <Route path={UPDATE_PROFILE} element={<CreateAdminOrUpdateAnyUserProfilePage mode='update'/>}/>
                <Route path={CREATE_ADMIN_USER} element={<CreateAdminOrUpdateAnyUserProfilePage mode='create'/>}/>
                <Route path={USER} element={<UserPage/>}/>
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
