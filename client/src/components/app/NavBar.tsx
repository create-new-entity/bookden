import {
    AppBar, Avatar, Box,
    Button, IconButton, Menu, MenuItem,
    Stack, Toolbar,
    useTheme,
    type Theme
} from '@mui/material';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

import { useNavContext, useThemeModeContext } from '../../contexts';
import { CustomAutoComplete } from '../custom';
import { useBookSearchVisibility } from '../../hooks';
import { NAV_BAR_Z_INDEX } from '../../constants';

const getStyles = (_theme: Theme) => {
    return {
        appBar: {
            zIndex: NAV_BAR_Z_INDEX
        },
        stack: {
            width: '100%',
            height: '100%',
            justifyContent: {
                xs: 'flex-start',
                sm: 'space-between'
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
    const { isLightMode } = useThemeModeContext();
    const navigate = useNavigate();
    const showBookSearch = useBookSearchVisibility();
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <AppBar sx={styles.appBar} position='sticky'>
            <Toolbar>
                <Stack direction={'row'} sx={styles.stack}>
                    <IconButton sx={styles.menuIcon} onClick={() => setShowNavDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Button sx={styles.logoButton} onClick={() => navigate('/')}>
                        <Box sx={{ height: '2.5rem' }}>
                            <img
                                src={ isLightMode ? `${import.meta.env.BASE_URL}assets/book-den-black.svg` : `${import.meta.env.BASE_URL}assets/book-den-white.svg` }
                                alt="Book Den Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    </Button>
                    {
                        showBookSearch && (
                            <CustomAutoComplete
                                id='navSearchBox'
                                sx={{ ...styles.searchBox, ...{ display: { xs: 'none', sm: 'block' } } }}
                                handleChange={() => {}}
                                placeholder='Search books'
                            />
                        )
                    }
                    <Avatar data-testid='user-avatar' sx={{ display: { xs: 'none', sm: 'flex' } }} onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                        setAnchorElement(e.currentTarget);
                        setMenuOpen(true);
                    }}/>
                    <Menu
                        anchorEl={anchorElement}
                        open={menuOpen}
                        onClose={() => {
                            setMenuOpen(false);
                            setAnchorElement(null);
                        }}
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