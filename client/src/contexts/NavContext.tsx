
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ThemeSwitch } from '../components';
import type { UserType, NavContextValue, NavOption } from '../types';
import useAuthContext from './AuthContext.tsx';
import {
    ADMIN, ADMIN_TOOLS, ALL_TYPES_OF_USERS,
    BOOKS, CART, CUSTOMER,
    HOME, SUPERADMIN, UPDATE_PROFILE, WISHLIST } from '../constants';
import { useThemeModeContext } from './index.ts';

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
    const [options, setOptions] = useState<NavOption[]>([]);
    const { isLightMode, handleThemeModeSwitch } = useThemeModeContext();

    const { isUserLoggedIn, existingLoggedInData } = hasExistingLoggedInUser();
    const userType = existingLoggedInData?.userType;
    
    useEffect(() => {
        const switchModeComponent = (
            <Stack direction={'row'} justifyContent={'space-evenly'} alignItems={'center'} gap={1}>
                <Typography variant='body1'>
                    {
                        isLightMode ? 'Dark mode' : 'Light mode'
                    }
                </Typography>
                <ThemeSwitch/>
            </Stack>
        );

        const homeOption = {
            name: 'home',
            action: () => {
                navigate(HOME);
                setShowNavDrawer(false);
            },
            component: <Typography variant='body1'>Home</Typography>,
            access: ALL_TYPES_OF_USERS
        };
    
        const cartOption = {
            name: 'cart',
            action: () => {
                navigate(CART);
                setShowNavDrawer(false);
            },
            component: <Typography variant='body1'>Cart</Typography>,
            access: [CUSTOMER]
        };
    
        const switchModeOption = {
            name: 'switchMode',
            action: () => {
                handleThemeModeSwitch();
                setShowNavDrawer(false);
            },
            component: switchModeComponent,
            access: ALL_TYPES_OF_USERS
        };

        if(userType && isUserLoggedIn) {
            const defaultOptions = [
                homeOption,
                {
                    name: 'books',
                    action: () => {
                        navigate(BOOKS);
                        setShowNavDrawer(false);
                    },
                    component: <Typography variant='body1'>Books</Typography>,
                    access: ALL_TYPES_OF_USERS
                },
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
                cartOption,
                {
                    name: 'adminTools',
                    action: () => {
                        navigate(ADMIN_TOOLS);
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Admin Tools</Typography>,
                    access: [SUPERADMIN, ADMIN]
                },
                switchModeOption,
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
                homeOption,
                {
                    name: 'books',
                    action: () => {
                        navigate('/books');
                        setShowNavDrawer(false);
                    },
                    component: <Typography>Books</Typography>,
                    access: []
                },
                cartOption,
                switchModeOption,
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
    }, [
        userType, clearAuthentication, navigate,
        isUserLoggedIn, handleThemeModeSwitch, setShowNavDrawer, isLightMode
    ]);
    
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