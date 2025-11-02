import { AppBar, Autocomplete, Avatar, Box, Button, IconButton, Menu, MenuItem, Stack, TextField, Toolbar, useTheme } from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';


const styles: Record<string, React.CSSProperties> = {
    rootStack: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    searchAndAvatarContainerStack: {
        width: '66%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    searchBox: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '40%'
    },
    bookdenLogo: {
        height: '2.5rem'
    }
};

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<null | HTMLDivElement>(null);
    const theme = useTheme();
    const hideInSmallerScreens = { display: { xs: 'none', sm: 'block' } };

    return (
        <AppBar>
            <Toolbar>
                <Stack direction={'row'} sx={styles.rootStack}>
                    <IconButton sx={{ display: { sm: 'none' } }}>
                        <MenuIcon fontSize='large'/>
                    </IconButton>
                    <Button sx={{ ...hideInSmallerScreens }} onClick={() => console.log('Clicked home logo')}>
                        <Box sx={{ ...styles.bookdenLogo, color: 'yellow' }}>
                            <img
                                src="/assets/book-den-black.svg"
                                alt="Book Den Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', color: 'purple' }}
                            />
                        </Box>
                    </Button>
                    <Autocomplete
                        sx={[styles.searchBox, hideInSmallerScreens]}
                        options={[]}
                        renderInput={(params) => <TextField {...params} sx={{ backgroundColor: theme.palette.primary.light, borderRadius: '0.5rem' }} slotProps={{ input: { startAdornment: <SearchIcon/>}}}/>}
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
                        <MenuItem onClick={() => console.log('Clicked Profile')}>Profile</MenuItem>
                        <MenuItem onClick={() => console.log('Clicked My account')}>My account</MenuItem>
                        <MenuItem onClick={() => console.log('Clicked Logout')}>Logout</MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;