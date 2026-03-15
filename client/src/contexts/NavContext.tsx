
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ThemeSwitch } from '../components';
import type { UserType, NavContextValue, NavOption } from '../types';
import useAuthContext from './AuthContext.tsx';
import { ADMIN, ADMIN_TOOLS, ALL_TYPES_OF_USERS, CUSTOMER, SUPERADMIN, UPDATE_PROFILE, WISHLIST } from '../constants';

const defaultContextValue: NavContextValue = {
    options: [],
    setOptions: () => {},
    showNavDrawer: false,
    setShowNavDrawer: () => {}
};

const filterOutUnAuthorizedOptions = (userType: UserType) => {
    return (option: NavOption): boolean => {
        return option.access.includes(userType);
    };
};

const NavContext = createContext(defaultContextValue);

export const NavProvider = ({ children }: { children: ReactNode }) => {
    const [showNavDrawer, setShowNavDrawer] = useState(false);
    const navigate = useNavigate();
    const { clearAuthentication, hasExistingLoggedInUser } = useAuthContext();
    const { isUserLoggedIn, existingLoggedInData } = hasExistingLoggedInUser();
    const userType = existingLoggedInData?.userType;
    
    const [options, setOptions] = useState<NavOption[]>([]);

    useEffect(() => {
        if(userType && isUserLoggedIn) {
            const defaultOptions = [
                {
                    name: 'profile',
                    action: () => {
                        navigate(UPDATE_PROFILE);
                        setShowNavDrawer(false);
                    },
                    component: <Typography variant='body1'>Profile</Typography>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'wishlist',
                    action: () => {
                        navigate(WISHLIST);
                        setShowNavDrawer(false);
                    },
                    component: <Typography variant='body1'>Wishlist</Typography>,
                    access: [CUSTOMER]
                },
                {
                    name: 'adminTools',
                    action: () => {
                        navigate(ADMIN_TOOLS);
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Admin Tools</Typography>,
                    access: [SUPERADMIN, ADMIN]
                },
                {
                    name: 'switchMode',
                    action: () => {},
                    component: <ThemeSwitch/>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'logout',
                    action: () => {
                        clearAuthentication();
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Logout</Typography>,
                    access: ALL_TYPES_OF_USERS
                }
            ].filter(filterOutUnAuthorizedOptions(userType));
            setOptions(defaultOptions);
        }
        else {
            setOptions([
                {
                    name: 'books',
                    action: () => {
                        navigate('/books');
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Books</Typography>,
                    access: []
                },
                {
                    name: 'login',
                    action: () => {
                        navigate('/auth');
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Login</Typography>,
                    access: []
                }
            ]);
        }
    }, [userType, clearAuthentication, navigate, isUserLoggedIn]);
    
    const value: NavContextValue = {
        options,
        setOptions,
        showNavDrawer,
        setShowNavDrawer
    };

    return (
        <NavContext.Provider value={value}>
            {children}
        </NavContext.Provider>
    );
};

const useNavContext = () => {
    return useContext(NavContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useNavContext;