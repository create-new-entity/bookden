
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { NavContextValue, NavOption } from '../types/NavContext.ts';
import { Typography } from '@mui/material';
import ThemeSwitch from '../components/ThemeSwitch.tsx';
import { ADMIN, ALL_TYPES_OF_USERS, SUPERADMIN } from '../constants/utilConstants.ts';
import useAuthContext from './AuthContext.tsx';
import type { UserType } from '../types/Users.ts';

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
    const { userType, handleLoggedOutContext } = useAuthContext();
    
    const [options, setOptions] = useState<NavOption[]>([]);

    useEffect(() => {
        if(userType) {
            const defaultOptions = [
                {
                    name: 'profile',
                    action: () => console.log('Clicked Profile.'),
                    component: <Typography variant='body1'>Profile</Typography>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'adminTools',
                    action: () => console.log('Clicked Admin Tools'),
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
                    action: handleLoggedOutContext,
                    component: <Typography>Logout</Typography>,
                    access: ALL_TYPES_OF_USERS
                }
            ].filter(filterOutUnAuthorizedOptions(userType));
            setOptions(defaultOptions);
        }
    }, [userType, handleLoggedOutContext]);
    
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