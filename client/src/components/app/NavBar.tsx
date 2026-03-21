import {
    AppBar, Avatar, Badge, Box,
    IconButton, Menu, MenuItem,
    Stack, Toolbar, Tooltip, Typography, useTheme, type Theme
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useAuthContext, useAvatarContext, useCartContext, useNavContext } from '../../contexts';
import { SearchInput } from '../custom';
import { ADMIN, CART, NAV_BAR_Z_INDEX, SUPERADMIN } from '../../constants';
import { useAvatar, useBookSearchVisibility, useResponsive } from '../../hooks';
import LoginActionIcon from './ActionIcons/LoginActionIcon';
import ThemeSwitchIconOnly from './ThemeSwitch';
import type { UserType } from '../../types';

const getStyles = (_theme: Theme) => {
    return {
        appBar: {
            zIndex: NAV_BAR_Z_INDEX
        },
        stack: {
            width: '100%',
            height: '100%'
        },
        menuIcon: {
            display: { sm: 'none' }
        },
        logoButton: {
            position: {
                xs: 'absolute',
                sm: 'static'
            },
            left: {
                xs: '50%',
                sm: 'auto'
            },
            transform: {
                xs: 'translateX(-50%)',
                sm: 'none'
            }
        },
        searchBox: {
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%'
        },
    };
};


const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<null | HTMLDivElement>(null);
    const { setShowNavDrawer, options } = useNavContext();
    const { userType, isLoggedIn } = useAuthContext();
    const isBookSearchVisible = useBookSearchVisibility();
    const theme = useTheme();
    const navigate = useNavigate();
    const { isXs } = useResponsive();
    const { totalNumberOfBooksInCart } = useCartContext();
    const { avatarUrl } = useAvatarContext();

    useAvatar();

    const styles = getStyles(theme);
    const handleSearchChange = (value: string) => {
        navigate(`/books?search=${value}`);
    };

    const isAdminOrSuperAdmin = userType === ADMIN || userType === SUPERADMIN;
    
    return (
        <AppBar sx={styles.appBar} position='sticky'>
            <Toolbar>
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    sx={styles.stack}
                >
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                    >
                        <Link to='/'>
                            <Box sx={{ height: '2.5rem' }}>
                                <img
                                    src={`${import.meta.env.BASE_URL}assets/book-den-white.svg` }
                                    alt="Book Den Logo"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </Box>
                        </Link>
                        {
                            isAdminOrSuperAdmin &&
                            <Typography variant={'subtitle2'}>Admin</Typography>
                        }
                    </Stack>
                    {
                        isBookSearchVisible && (
                            <SearchInput
                                id='navSearchBox'
                                sx={{ ...styles.searchBox, ...{ display: { xs: 'none', sm: 'block' } } }}
                                handleChange={handleSearchChange}
                                placeholder='Search books'
                            />
                        )
                    }
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        alignItems={'center'}
                        gap={1}
                    >
                        {
                            !isAdminOrSuperAdmin &&
                            <Tooltip title='Cart'>
                                <Badge badgeContent={totalNumberOfBooksInCart} color='primary'>
                                    <IconButton
                                        component={Link}
                                        to={CART}
                                    >
                                        <ShoppingCartIcon />
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        }
                        {
                            !isLoggedIn && !isXs &&
                            <ThemeSwitchIconOnly/>
                        }
                        {
                            !isLoggedIn && !isXs &&
                            <LoginActionIcon
                                onClick={() => navigate('/auth')}
                                tooltipTitle='Login'
                            />
                        }
                        {
                            isLoggedIn &&
                            <Avatar
                                src={avatarUrl || undefined}
                                data-testid='user-avatar'
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                    setAnchorElement(e.currentTarget);
                                    setMenuOpen(true);
                                }}
                            />
                        }
                        <IconButton sx={styles.menuIcon} onClick={() => setShowNavDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                    </Stack>
                    <Menu
                        anchorEl={anchorElement}
                        open={menuOpen}
                        onClose={() => {
                            setMenuOpen(false);
                            setAnchorElement(null);
                        }}
                        disableScrollLock
                    >
                        {
                            options.map((option) => {
                                return (
                                    <MenuItem
                                        data-testid={`${option.name}-menu-item`}
                                        key={option.name}
                                        onClick={option.action}
                                    >
                                        {option.component}
                                    </MenuItem>
                                );
                            })
                        }
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;