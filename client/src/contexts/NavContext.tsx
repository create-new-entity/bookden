
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ThemeSwitch } from '../components';
import type { UserType, NavContextValue, NavOption } from '../types';
import useAuthContext from './AuthContext.tsx';
import { ADMIN, ALL_TYPES_OF_USERS, SUPERADMIN } from '../constants';

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
    const { userType, clearAuthentication } = useAuthContext();
    
    const [options, setOptions] = useState<NavOption[]>([]);

    useEffect(() => {
        if(userType) {
            const defaultOptions = [
                {
                    name: 'profile',
                    action: () => {
                        navigate('/profile');
                        setShowNavDrawer(false);
                    },
                    component: <Typography variant='body1'>Profile</Typography>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'adminTools',
                    action: () => {
                        console.log('Clicked Admin Tools');
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
                    action: clearAuthentication,
                    component: <Typography>Logout</Typography>,
                    access: ALL_TYPES_OF_USERS
                }
            ].filter(filterOutUnAuthorizedOptions(userType));
            setOptions(defaultOptions);
        }
    }, [userType, clearAuthentication, navigate]);
    
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