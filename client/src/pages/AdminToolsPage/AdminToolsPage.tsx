import { Paper, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
// import BarChartIcon from '@mui/icons-material/BarChart';

import AdminToolCard from './AdminToolCard';
import { useNavigate } from 'react-router-dom';
import { useSetTabTitle } from '../../hooks';

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
            height: '85vh',
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
            alignSelf: 'stretch',
            borderRadius: 'unset'
        }
    };
};

const AdminToolsPage = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();

    useSetTabTitle('Admin Tools');

    const handleUserManagementClick = () => {
        navigate('/user-management');
    };

    const handleBookManagementClick = () => {
        navigate('/book-management');
    };

    return (
        <Stack sx={styles.rootStack} direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
            <Paper sx={styles.rootPaper} elevation={2}>
                <Stack sx={styles.toolsStack} direction={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                    <AdminToolCard
                        data-testid='user-management-card'
                        icon={<PeopleAltIcon fontSize='large'/>}
                        iconButtonStyles={styles.iconButton}
                        title='User Management'
                        subtitle='Find users, review their details, and remove accounts when needed.'
                        iconAndTextStackStyles={styles.iconAndTextStack}
                        onClick={handleUserManagementClick}
                        paperStyles={styles.toolPaper}
                    />
                    <AdminToolCard
                        data-testid='book-management-card'
                        icon={<MenuBookIcon fontSize='large'/>}
                        iconButtonStyles={styles.iconButton}
                        title='Book Management'
                        subtitle='Manage books, add new ones, and update existing ones.'
                        iconAndTextStackStyles={styles.iconAndTextStack}
                        onClick={handleBookManagementClick}
                        paperStyles={styles.toolPaper}
                    />
                    {
                        /*
                            <AdminToolCard
                                data-testid='analytics-card'
                                icon={<BarChartIcon fontSize='large'/>}
                                iconButtonStyles={styles.iconButton}
                                title='Analytics'
                                subtitle='View analytics data for users and books.'
                                iconAndTextStackStyles={styles.iconAndTextStack}
                                onClick={() => {}}
                                paperStyles={styles.toolPaper}
                            />
                        */
                    }
                </Stack>
            </Paper>
        </Stack>
    );
};

export default AdminToolsPage;