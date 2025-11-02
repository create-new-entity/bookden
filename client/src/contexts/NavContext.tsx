
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { NavContextValue, NavOption } from '../types/NavContext.ts';

const defaultOptions = [
    {
        name: 'profile',
        text: 'Profile',
        action: () => console.log('Clicked Profile.')
    },
    {
        name: 'myAccount',
        text: 'My Account',
        action: () => console.log('Clicked My Account.')
    },
    {
        name: 'logout',
        text: 'Logout',
        action: () => console.log('Clicked Logout.')
    }
];

const defaultContextValue: NavContextValue = {
    options: defaultOptions,
    setOptions: () => {},
    showNavDrawer: false,
    setShowNavDrawer: () => {}
};

const NavContext = createContext(defaultContextValue);

export const NavProvider = ({ children }: { children: ReactNode }) => {
    const [showNavDrawer, setShowNavDrawer] = useState(false);
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