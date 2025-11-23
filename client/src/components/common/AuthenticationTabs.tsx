import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

import LogInTab from './LogInTab';
import SignUpTab from './SignUpTab';
import { useThemeModeContext } from '../../contexts';

const styles: Record<string, React.CSSProperties> = {
    rootContainer: {
        alignSelf: 'stretch',
        flex: 1,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',

        padding: '0.5rem',
        paddingTop: '13rem'
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


const AuthenticationTabs = () => {
    const [value, setValue] = React.useState('logIn');
    const theme = useTheme();
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
                        <Tab label="Log In" value={'logIn'} />
                        <Tab label="Sign Up" value={'signUp'} />
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