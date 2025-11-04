
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { NavContextValue, NavOption } from '../types/NavContext.ts';
import { Typography } from '@mui/material';
import ThemeSwitch from '../components/ThemeSwitch.tsx';

const defaultContextValue: NavContextValue = {
    options: [],
    setOptions: () => {},
    showNavDrawer: false,
    setShowNavDrawer: () => {}
};

const NavContext = createContext(defaultContextValue);

export const NavProvider = ({ children }: { children: ReactNode }) => {
    const [showNavDrawer, setShowNavDrawer] = useState(false);
    const defaultOptions = [
        {
            name: 'profile',
            action: () => console.log('Clicked Profile.'),
            component: <Typography variant='body1'>Profile</Typography>
        },
        {
            name: 'myAccount',
            action: () => console.log('Clicked My Account.'),
            component: <Typography>My Account</Typography>
        },
        {
            name: 'logout',
            action: () => console.log('Clicked Logout.'),
            component: <Typography>Logout</Typography>,
        },
        {
            name: 'switchMode',
            action: () => {},
            component: <ThemeSwitch/>
        }
    ];
    const [options, setOptions] = useState<NavOption[]>(defaultOptions);
    
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