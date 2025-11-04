import { AppBar, Autocomplete, Avatar, Box, Button, IconButton, Menu, MenuItem, Stack, TextField, Toolbar, useTheme } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import useNavContext from '../contexts/NavContext';

const styles = {
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


const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<null | HTMLDivElement>(null);
    const theme = useTheme();
    const { setShowNavDrawer, options } = useNavContext();

    return (
        <AppBar>
            <Toolbar>
                <Stack direction={'row'} sx={styles.stack}>
                    <IconButton sx={styles.menuIcon} onClick={() => setShowNavDrawer(true)}>
                        <MenuIcon fontSize='large'/>
                    </IconButton>
                    <Button sx={styles.logoButton} onClick={() => console.log('Clicked home logo')}>
                        <Box sx={{ height: '2.5rem' }}>
                            <img
                                src="/assets/book-den-black.svg"
                                alt="Book Den Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    </Button>
                    <Autocomplete
                        sx={{ ...styles.searchBox, ...{ display: { xs: 'none', sm: 'block' } } }}
                        options={[]}
                        renderInput={(params) => <TextField {...params} sx={{
                            borderRadius: '0.5rem'
                        }} slotProps={{ input: { startAdornment: <SearchIcon/>}}}/>}
                    />
                    <Avatar sx={{ display: { xs: 'none', sm: 'flex' } }} onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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