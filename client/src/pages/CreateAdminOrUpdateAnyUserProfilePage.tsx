import { Paper, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    CreateAdminUserForm, UpdateUserForm
} from '../components';
import { useAuthContext } from '../contexts';
import { useAvatar, useSetTabTitle } from '../hooks';
import { AVATAR_DIMENSIONS, MARGIN_TOP_TO_AVOID_NAV_BAR } from '../constants';


type ProfilePageStyles = {
    paper: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    avatar: SxProps<Theme>;
};

const getProfilePageStyles = (theme: Theme): ProfilePageStyles => {
    return {
        paper: {
            width: '90%',
            padding: '1rem',
            [theme.breakpoints.between('xs', 'lg')]: {
                backgroundColor: theme.palette.action.hover
            },
        },
        rootStack: {
            minHeight: '70vh',
            paddingTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        avatar: {
            width: `${AVATAR_DIMENSIONS}px`,
            height: `${AVATAR_DIMENSIONS}px`
        }
    };
};


export type CreateAdminOrUpdateAnyUserProfilePageProps = {
    mode: 'update' | 'create';
};

const CreateAdminOrUpdateAnyUserProfilePage = (props: CreateAdminOrUpdateAnyUserProfilePageProps) => {
    const { mode } = props;

    const { hasExistingLoggedInUser, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const { isUserLoggedIn } = hasExistingLoggedInUser();
    const resolvedIsLoggedIn = isLoggedIn || isUserLoggedIn;


    useAvatar();
    useEffect(() => {
        if(!resolvedIsLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, resolvedIsLoggedIn]);

    useSetTabTitle('Update Profile');

    const styles = getProfilePageStyles(theme);


    return (
        <Stack sx={styles.rootStack} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <Paper sx={styles.paper} elevation={2}>
                <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    {
                        mode === 'update'
                            ?
                            <UpdateUserForm/>
                            :
                            null
                    }
                    {
                        mode === 'create'
                            ?
                            <CreateAdminUserForm/>
                            :
                            null
                    }
                </Stack>
            </Paper>
        </Stack>
    );
};

export default CreateAdminOrUpdateAnyUserProfilePage;