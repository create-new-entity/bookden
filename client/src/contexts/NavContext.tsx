
import {
    createContext, useCallback, useContext,
    useEffect, useMemo, useState, type ReactNode
} from 'react';
import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
    setShowNavDrawer: () => {},
    populateLoggedInOptions: () => {},
    populatePublicOptions: () => {}
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
    const { clearAuthentication, hasExistingLoggedInUser, userType } = useAuthContext();
    const [options, setOptions] = useState<NavOption[]>([]);
    const { isLightMode, handleThemeModeSwitch } = useThemeModeContext();

    const { existingLoggedInData, isUserLoggedIn } = hasExistingLoggedInUser();
    const resolvedUserType = useMemo(() => {
        return userType || existingLoggedInData?.userType;
    }, [userType, existingLoggedInData?.userType]);

    const switchModeComponentDetails = useMemo(() => {
        return {
            icon: isLightMode ? <ModeNightIcon/> : <LightModeIcon/>,
            title: isLightMode ? 'Dark mode' : 'Light mode'
        };
    }, [isLightMode]);

    const homeOption = useMemo(() => {
        return {
            name: 'home',
            action: () => {
                navigate(HOME);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<HomeIcon/>} title='Home'/>,
            access: ALL_TYPES_OF_USERS
        };
    }, [navigate, setShowNavDrawer]);

    const bookOption = useMemo(() => {
        return {
            name: 'books',
            action: () => {
                navigate(BOOKS);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<MenuBookIcon/>} title='Books'/>,
            access: ALL_TYPES_OF_USERS
        };
    }, [navigate, setShowNavDrawer]);

    const cartOption = useMemo(() => {
        return {
            name: 'cart',
            action: () => {
                navigate(CART);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<ShoppingCartIcon/>} title='Cart'/>,
            access: [CUSTOMER]
        };
    }, [navigate, setShowNavDrawer]);

    const switchModeOption = useMemo(() => {
        return {
            name: 'switchMode',
            action: () => {
                handleThemeModeSwitch();
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={switchModeComponentDetails.icon} title={switchModeComponentDetails.title}/>,
            access: ALL_TYPES_OF_USERS
        };
    }, [handleThemeModeSwitch, setShowNavDrawer, switchModeComponentDetails.icon, switchModeComponentDetails.title]);

    const profileOption = useMemo(() => {
        return {
            name: 'profile',
            action: () => {
                navigate(UPDATE_PROFILE);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<AccountCircleIcon/>} title='Profile'/>,
            access: ALL_TYPES_OF_USERS
        };
    }, [navigate, setShowNavDrawer]);

    const wishListOption = useMemo(() => {
        return {
            name: 'wishlist',
            action: () => {
                navigate(WISHLIST);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<FavoriteIcon/>} title='Wishlist'/>,
            access: [CUSTOMER]
        };
    }, [navigate, setShowNavDrawer]);

    const adminToolsOption = useMemo(() => {
        return {
            name: 'adminTools',
            action: () => {
                navigate(ADMIN_TOOLS);
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<HandymanIcon/>} title='Admin Tools'/>,
            access: [SUPERADMIN, ADMIN]
        };
    }, [navigate, setShowNavDrawer]);

    const logoutOption = useMemo(() => {
        return {
            name: 'logout',
            action: () => {
                clearAuthentication();
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<LogoutIcon/>} title='Logout'/>,
            access: ALL_TYPES_OF_USERS
        };
    }, [clearAuthentication, setShowNavDrawer]);

    const loginOption = useMemo(() => {
        return {
            name: 'login',
            action: () => {
                navigate('/auth');
                setShowNavDrawer(false);
            },
            component: <NavContextMenuComponent icon={<LoginIcon/>} title='Login'/>,
            access: []
        };
    }, [navigate, setShowNavDrawer]);

    const populateLoggedInOptions = useCallback(() => {
        if(!resolvedUserType) {
            setOptions([]);
            return;
        }
        const defaultOptions = [
            homeOption, profileOption, bookOption,
            wishListOption, cartOption, adminToolsOption,
            switchModeOption, logoutOption
        ].filter(filterOutUnAuthorizedOptions(resolvedUserType));
        setOptions(defaultOptions);
    }, [
        resolvedUserType, bookOption, cartOption,
        switchModeOption, homeOption, profileOption,
        wishListOption, adminToolsOption, logoutOption
    ]);

    const populatePublicOptions = useCallback(() => {
        setOptions([ homeOption, bookOption, cartOption, switchModeOption, loginOption ]);
    }, [homeOption, bookOption, cartOption, switchModeOption, loginOption]);
    
    useEffect(() => {
        if(resolvedUserType && isUserLoggedIn) {
            populateLoggedInOptions();
        }
        else {
            populatePublicOptions();
        }
    }, [ resolvedUserType, isUserLoggedIn, populateLoggedInOptions, populatePublicOptions ]);
    
    const value: NavContextValue = {
        options,
        setOptions,
        showNavDrawer,
        setShowNavDrawer,
        populateLoggedInOptions,
        populatePublicOptions
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