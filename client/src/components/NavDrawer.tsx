import { Box, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import useNavContext from '../contexts/NavContext';

const NavDrawer = () => {
    const { options, showNavDrawer, setShowNavDrawer } = useNavContext();
    const handleDrawerClose = (_event: React.SyntheticEvent, _reason: 'escapeKeyDown' | 'backdropClick') => {
        setShowNavDrawer(false);
    };
    return (
        <nav>
            <Drawer
                variant="temporary"
                open={showNavDrawer}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { width: '80%' },
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    {/* <Divider /> */}
                    <List>
                        {options.map((option) => (
                            <ListItem key={option.name} disablePadding>
                                <ListItemButton sx={{ textAlign: 'center' }} onClick={option.action}>
                                    <ListItemText primary={option.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </nav>
    );
};

export default NavDrawer;