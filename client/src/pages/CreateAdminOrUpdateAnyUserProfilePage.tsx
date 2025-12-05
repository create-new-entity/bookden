import { Avatar, Badge, Paper, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddAvatarButton, CreateAdminUserForm, UpdateOrDeleteAvatarButtonsStack, UpdateUserForm } from '../components';
import { useAuthContext, useAvatarContext } from '../contexts';
import { useAvatar, useSetTabTitle } from '../hooks';
import { AVATAR_DIMENSIONS } from '../constants';

const ICON_BUTTONS_STACK_OFFSET_LEFT = -0.3;
const ICON_BUTTONS_STACK_OFFSET_TOP = 1.5;


type ProfilePageStyles = {
    paper: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    avatar: SxProps<Theme>;
    iconButtonsStack: SxProps<Theme>;
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
            height: '90vh'
        },
        avatar: {
            width: `${AVATAR_DIMENSIONS}px`,
            height: `${AVATAR_DIMENSIONS}px`
        },
        iconButtonsStack: {
            position: 'relative',
            top: `${ICON_BUTTONS_STACK_OFFSET_TOP}rem`,
            left: `${ICON_BUTTONS_STACK_OFFSET_LEFT}rem`
        }
    };
};


const WrapperStack = ({ children }: { children: ReactNode }) => {
    const theme = useTheme();
    const styles = getProfilePageStyles(theme);
    return (
        <Stack sx={styles.iconButtonsStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
            {children}
        </Stack>
    );
};

export type CreateAdminOrUpdateAnyUserProfilePageProps = {
    mode: 'update' | 'create';
};

const CreateAdminOrUpdateAnyUserProfilePage = (props: CreateAdminOrUpdateAnyUserProfilePageProps) => {
    const { mode } = props;
    const { avatarUrl, isPlaceHolderAvatar } = useAvatarContext();
    const { hasExistingLoggedInUser } = useAuthContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const styles = getProfilePageStyles(theme);
    const { isUserLoggedIn } = hasExistingLoggedInUser();

    useAvatar();
    useEffect(() => {
        if(!isUserLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, hasExistingLoggedInUser, isUserLoggedIn]);

    useSetTabTitle('Update Profile');

    const updateOrDeleteAvatarOptions = (
        <WrapperStack>
            <UpdateOrDeleteAvatarButtonsStack/>
        </WrapperStack>
    );
    const addAvatarOption = (
        <WrapperStack>
            <AddAvatarButton/>
        </WrapperStack>
    );
    const badgeContent = isPlaceHolderAvatar ? addAvatarOption : updateOrDeleteAvatarOptions;

    return (
        <Stack sx={styles.rootStack} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <Paper sx={styles.paper} elevation={2}>
                <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    {
                        mode === 'update'
                            ?
                            <>
                                <Badge badgeContent={badgeContent}>
                                    <Avatar data-testid='profile-avatar' sx={styles.avatar} alt={'Profile Avatar'} src={avatarUrl}/>
                                </Badge>
                                <UpdateUserForm/>
                            </>
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