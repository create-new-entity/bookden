import { Paper, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import { useEffect } from 'react';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BarChartIcon from '@mui/icons-material/BarChart';

import AdminToolCard from './AdminToolCard';

type Styles = {
    rootStack: SxProps<Theme>;
    toolPaper: SxProps<Theme>;
    toolsStack: SxProps<Theme>;
    iconButton: SxProps<Theme>;
    iconAndTextStack: SxProps<Theme>;
    rootPaper: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            height: '90vh',
            marginTop: '2rem',
            gap: '1.5rem'
        },
        rootPaper: {
            width: '90%',
            minWidth: 'fit-content'
        },
        toolsStack: {
            flexWrap: 'wrap'
        },
        toolPaper: {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '0.5rem',
            padding: '0.5rem',
            margin: '0.5rem',
            height: '100%',
            width: '100%'
        },
        iconAndTextStack: {
            gap: '0.5rem'
        },
        iconButton: {
            alignSelf: 'stretch'
        }
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
            <Paper sx={styles.rootPaper} elevation={2}>
                <Stack sx={styles.toolsStack} direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                    <AdminToolCard
                        icon={<PeopleAltIcon fontSize='large'/>}
                        iconButtonStyles={styles.iconButton}
                        title='User Management'
                        subtitle='Find users, review their details, and remove accounts when needed.'
                        iconAndTextStackStyles={styles.iconAndTextStack}
                        onClick={() => {}}
                        paperStyles={styles.toolPaper}
                    />
                    <AdminToolCard
                        icon={<MenuBookIcon fontSize='large'/>}
                        iconButtonStyles={styles.iconButton}
                        title='Book Management'
                        subtitle='Manage books, add new ones, and update existing ones.'
                        iconAndTextStackStyles={styles.iconAndTextStack}
                        onClick={() => {}}
                        paperStyles={styles.toolPaper}
                    />
                    <AdminToolCard
                        icon={<BarChartIcon fontSize='large'/>}
                        iconButtonStyles={styles.iconButton}
                        title='Analytics'
                        subtitle='View analytics data for users and books.'
                        iconAndTextStackStyles={styles.iconAndTextStack}
                        onClick={() => {}}
                        paperStyles={styles.toolPaper}
                    />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default AdminToolsPage;