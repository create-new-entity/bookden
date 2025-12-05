import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography, useMediaQuery, useTheme, type SxProps, type Theme } from '@mui/material';
import React from 'react';

import LogInTab from './LogInTab';
import SignUpTab from './SignUpTab';
import { useThemeModeContext } from '../../contexts';

type Styles = {
    rootContainer: SxProps<Theme>;
    tabPanelsContainer: SxProps<Theme>;
    tabPanel: SxProps<Theme>;
    bookdenLogo: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootContainer: {
            alignSelf: 'stretch',
            flex: 1,
    
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.success.light,
    
            padding: '0.5rem',
            marginTop: '-5rem'
        },
    
        tabPanelsContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'stretch'
        },
        tabPanel: {
            padding: 0,
            flex: 1
        },
    
        bookdenLogo: {
            height: '5rem'
        }
    };
};


const AuthenticationTabs = () => {
    const [value, setValue] = React.useState('logIn');
    const theme = useTheme();
    const styles = getStyles(theme);
    const { isLightMode } = useThemeModeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    
    return (
        <TabContext value={value}>
            <Box sx={styles.rootContainer}>
                {
                    isMobile &&
                    <>
                        <Box sx={styles.bookdenLogo}>
                            <img
                                src={isLightMode ? `${import.meta.env.BASE_URL}assets/book-den-black.svg` : `${import.meta.env.BASE_URL}assets/book-den-white.svg` }
                                alt="Book Den Logo"
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                        <Typography variant='body1'>Find and grab your next favourite book.</Typography>
                    </>
                }
                <Box>
                    <TabList onChange={handleChange}>
                        <Tab data-testid='login-tab' label="Log In" value={'logIn'} />
                        <Tab data-testid='signup-tab' label="Sign Up" value={'signUp'} />
                    </TabList>
                </Box>
                <Box sx={styles.tabPanelsContainer}>
                    <TabPanel sx={styles.tabPanel} value={'logIn'}><LogInTab/></TabPanel>
                    <TabPanel sx={styles.tabPanel} value={'signUp'}><SignUpTab/></TabPanel>
                </Box>
            </Box>
        </TabContext>
    );
};

export default AuthenticationTabs;