import { Avatar, Badge, Paper, Stack, useTheme, type SxProps, type Theme } from '@mui/material';
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AddAvatarButton, UpdateOrDeleteAvatarButtonsStack } from './UtilityComponents';
import { useAuthContext, useAvatarContext } from '../../contexts';
import UpdateUserForm from './UpdateUserForm';
import { useAvatar } from '../../hooks';


const AVATAR_DIMENSIONS = '13rem';
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
            width: AVATAR_DIMENSIONS,
            height: AVATAR_DIMENSIONS
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

const ProfilePage = () => {
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

    useEffect(() => {
        document.title = 'Profile';
    }, []);

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
                    <Badge badgeContent={badgeContent}>
                        <Avatar sx={styles.avatar} alt={'Profile Avatar'} src={avatarUrl}/>
                    </Badge>
                    <UpdateUserForm/>
                </Stack>
            </Paper>
        </Stack>
    );
};

export default ProfilePage;