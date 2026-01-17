import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Snackbar } from '@mui/material';

import { useAuthContext, useNavContext, useNotificationContext } from './contexts';
import { NavBar, NavDrawer } from './components';
import {
    NOTIFICATION_DELAY
} from './constants';
import { AppRoutes } from './routes';

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
            <AppRoutes/>
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
