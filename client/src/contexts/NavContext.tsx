
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandymanIcon from '@mui/icons-material/Handyman';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';


import type { UserType, NavContextValue, NavOption } from '../types';
import useAuthContext from './AuthContext.tsx';
import {
    ADMIN, ADMIN_TOOLS, ALL_TYPES_OF_USERS,
    BOOKS, CART, CUSTOMER,
    HOME, SUPERADMIN, UPDATE_PROFILE, WISHLIST } from '../constants';
import { useThemeModeContext } from './index.ts';

type NavContextMenuComponentProps = {
    icon: React.ReactNode;
    title: string;
};

const NavContextMenuComponent = (props: NavContextMenuComponentProps) => {
    const { icon, title } = props;
    return (
        <Stack
            direction={'row'}
            justifyContent={'space-evenly'}
            alignItems={'center'}
            gap={1}
        >
            {icon}
            <Typography variant='body1'>{title}</Typography>
        </Stack>
    );
};

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

        const switchModeComponentDetails = {
            icon: isLightMode ? <ModeNightIcon/> : <LightModeIcon/>,
            title: isLightMode ? 'Dark mode' : 'Light mode'
        };

        const homeOption = {
            name: 'home',
            action: () => {
                navigate(HOME);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<HomeIcon/>} title='Home'/>,
            access: ALL_TYPES_OF_USERS
        };
    
        const cartOption = {
            name: 'cart',
            action: () => {
                navigate(CART);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<AddShoppingCartIcon/>} title='Cart'/>,
            access: [CUSTOMER]
        };
    
        const switchModeOption = {
            name: 'switchMode',
            action: () => {
                handleThemeModeSwitch();
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={switchModeComponentDetails.icon} title={switchModeComponentDetails.title}/>,
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
                    component: <NavContextMenuComponent icon={<MenuBookIcon/>} title='Books'/>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'profile',
                    action: () => {
                        navigate(UPDATE_PROFILE);
                        setShowNavDrawer(false);
                    },
                    component: <NavContextMenuComponent icon={<AccountCircleIcon/>} title='Profile'/>,
                    access: ALL_TYPES_OF_USERS
                },
                {
                    name: 'wishlist',
                    action: () => {
                        navigate(WISHLIST);
                        setShowNavDrawer(false);
                    },
                    component: <NavContextMenuComponent icon={<FavoriteIcon/>} title='Wishlist'/>,
                    access: [CUSTOMER]
                },
                cartOption,
                {
                    name: 'adminTools',
                    action: () => {
                        navigate(ADMIN_TOOLS);
                        setShowNavDrawer(false);
                    },
                    component: <NavContextMenuComponent icon={<HandymanIcon/>} title='Admin Tools'/>,
                    access: [SUPERADMIN, ADMIN]
                },
                switchModeOption,
                {
                    name: 'logout',
                    action: () => {
                        clearAuthentication();
                        setShowNavDrawer(false);
                    },
                    component: <NavContextMenuComponent icon={<LogoutIcon/>} title='Logout'/>,
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
                    component: <NavContextMenuComponent icon={<LoginIcon/>} title='Login'/>,
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