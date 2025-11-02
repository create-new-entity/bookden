import { AppBar, Autocomplete, Avatar, Box, Button, Menu, MenuItem, Stack, TextField, Toolbar, useTheme } from '@mui/material';
import { useState } from 'react';


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
        transform: 'translateX(-50%)'
    },
    bookdenLogo: {
        height: '2.5rem'
    }
};

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<null | HTMLDivElement>(null);
    const theme = useTheme();

    return (
        <AppBar>
            <Toolbar>
                <Stack direction={'row'} sx={styles.rootStack}>
                    <Button onClick={() => console.log('Clicked home logo')}>
                        <Box sx={{ ...styles.bookdenLogo, color: 'yellow' }}>
                            <img
                                src="/assets/book-den-black.svg"
                                alt="Book Den Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', color: 'purple' }}
                            />
                        </Box>
                    </Button>
                    <Autocomplete
                        sx={styles.searchBox}
                        options={[]}
                        renderInput={() => <TextField/>}
                    />
                    <Avatar onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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