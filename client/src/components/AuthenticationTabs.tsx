import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React from 'react';
import LogInTab from './LogInTab';
import SignUpTab from './SignUpTab';

const styles: Record<string, React.CSSProperties> = {
    rootContainer: {
        alignSelf: 'stretch',
        flex: 1,

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

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
    }
};


const AuthenticationTabs = () => {
    const [value, setValue] = React.useState('logIn');
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    return (
        <TabContext value={value}>
            <Box sx={styles.rootContainer}>
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