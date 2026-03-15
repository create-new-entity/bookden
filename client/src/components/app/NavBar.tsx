import {
    AppBar, Avatar, Box,
    IconButton, Menu, MenuItem,
    Stack, Toolbar, Typography, useTheme, type Theme
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext, useNavContext } from '../../contexts';
import { SearchInput } from '../custom';
import { NAV_BAR_Z_INDEX } from '../../constants';
import { useBookSearchVisibility, useResponsive } from '../../hooks';
import LoginActionIcon from './ActionIcons/LoginActionIcon';

const getStyles = (_theme: Theme) => {
    return {
        appBar: {
            zIndex: NAV_BAR_Z_INDEX
        },
        stack: {
            width: '100%',
            height: '100%',
            justifyContent: {
                xs: 'space-between'
            },
            alignItems: 'center'
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
    const showBookSearch = useBookSearchVisibility();
    const theme = useTheme();
    const navigate = useNavigate();
    const { isXs } = useResponsive();

    const styles = getStyles(theme);
    const handleSearchChange = (value: string) => {
        navigate(`/books?search=${value}`);
    };

    const isAdminOrSuperAdmin = userType === 'admin' || userType === 'superadmin';

    return (
        <AppBar sx={styles.appBar} position='sticky'>
            <Toolbar>
                <Stack direction={'row'} sx={styles.stack}>
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
                        showBookSearch && (
                            <SearchInput
                                id='navSearchBox'
                                sx={{ ...styles.searchBox, ...{ display: { xs: 'none', sm: 'block' } } }}
                                handleChange={handleSearchChange}
                                placeholder='Search books'
                            />
                        )
                    }
                    {
                        isLoggedIn &&
                        <Avatar
                            data-testid='user-avatar'
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                setAnchorElement(e.currentTarget);
                                setMenuOpen(true);
                            }}
                        />
                    }
                    {
                        !isLoggedIn && !isXs &&
                        <LoginActionIcon
                            onClick={() => navigate('/auth')}
                            tooltipTitle='Login'
                        />
                    }
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
                    <IconButton sx={styles.menuIcon} onClick={() => setShowNavDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;