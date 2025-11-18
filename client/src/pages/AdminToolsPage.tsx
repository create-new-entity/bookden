import { IconButton, Paper, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useEffect } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';

type Styles = {
    rootStack: SxProps<Theme>;
    toolPaper: SxProps<Theme>;
    toolsStack: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            height: '90vh',
            marginTop: '2rem'
        },
        toolsStack: {
            flexWrap: 'wrap'
        },
        toolPaper: {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '0.5rem',
            padding: '0.5rem',
            margin: '0.5rem',
            height: '100%'
        },
    };
};

const AdminToolsPage = () => {
    const theme = useTheme();
    const styles = getStyles(theme);

    useEffect(() => {
        document.title = 'Admin Tools';
    }, []);

    return (
        <Stack sx={styles.rootStack} direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
            <Typography variant='h4'>Admin Tools</Typography>
            <Paper elevation={2}>
                <Stack sx={styles.toolsStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                    <IconButton>
                        <Paper sx={styles.toolPaper} elevation={2}>
                            <PeopleAltIcon fontSize='large'/>
                            <Typography variant='h6'>User</Typography>
                            <Typography variant='h6'>Management</Typography>
                        </Paper>
                    </IconButton>
                    <IconButton>
                        <Paper sx={styles.toolPaper} elevation={2}>
                            <MenuBookIcon fontSize='large'/>
                            <Typography variant='h6'>Book</Typography>
                            <Typography variant='h6'>Management</Typography>
                        </Paper>
                    </IconButton>
                    <IconButton>
                        <Paper sx={styles.toolPaper} elevation={2}>
                            <BarChartIcon fontSize='large'/>
                            <Typography variant='h6'>Analytics</Typography>
                            <Typography variant='h6'>Management</Typography>
                        </Paper>
                    </IconButton>
                </Stack>
            </Paper>
        </Stack>
    );
};

export default AdminToolsPage;