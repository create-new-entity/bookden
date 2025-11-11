import { Avatar, Badge, Container, Paper, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import useAvatarContext from '../../contexts/AvatarContext';
import useAuthContext from '../../contexts/AuthContext';
import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import useAvatar from '../../hooks/useAvatar';
import { AddAvatarButton, UpdateOrDeleteAvatarButtonsStack } from './UtilityComponents';


const AVATAR_DIMENSIONS = '13rem';
const ICON_BUTTONS_STACK_OFFSET_LEFT = -0.3;
const ICON_BUTTONS_STACK_OFFSET_TOP = 1.5;


type ProfilePageStyles = {
    container: SxProps<Theme>;
    paper: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    avatar: SxProps<Theme>;
    iconButtonsStack: SxProps<Theme>;
};

const getProfilePageStyles = (theme: Theme): ProfilePageStyles => {
    return {
        container: {
            height: '90vh'
        },
        paper: {
            height: '95%',
            width: '90%',
            padding: '1rem',
            [theme.breakpoints.between('xs', 'lg')]: {
                backgroundColor: theme.palette.action.hover
            },
        },
        rootStack: {
            height: '100%'
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
    const { username, hasExistingLoggedInUser } = useAuthContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const styles = getProfilePageStyles(theme);


    useAvatar();
    useEffect(() => {
        const { isUserLoggedIn } = hasExistingLoggedInUser();
        if(!isUserLoggedIn) {
            navigate('/auth');
        }
    }, [navigate, hasExistingLoggedInUser]);

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
        <Container sx={styles.container}>
            <Stack sx={styles.rootStack} direction={'column'} justifyContent={'center'} alignItems={'center'}>
                <Paper sx={styles.paper} elevation={2}>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Badge badgeContent={badgeContent}>
                            <Avatar sx={styles.avatar} alt={'Profile Avatar'} src={avatarUrl}/>
                        </Badge>
                        <Typography>Username: {username}</Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

export default ProfilePage;