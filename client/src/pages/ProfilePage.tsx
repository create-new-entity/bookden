import { Avatar, Badge, Container, IconButton, Paper, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import useAvatarContext from '../contexts/AvatarContext';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAvatar from '../hooks/useAvatar';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const AVATAR_DIMENSIONS = '13rem';
const ICON_BUTTONS_STACK_OFFSET_LEFT = -0.2;
const ICON_BUTTONS_STACK_OFFSET_TOP = 1;

type ProfilePageStyles = {
    container: SxProps<Theme>;
    paper: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    avatar: SxProps<Theme>;
    iconButton: SxProps<Theme>;
    iconButtonsStack: SxProps<Theme>;
};

const getProfilePageStyles = (_theme: Theme): ProfilePageStyles => {
    return {
        container: {
            height: '90vh'
        },
        paper: {
            height: '95%',
            padding: '1rem'
        },
        rootStack: {
            height: '100%'
        },
        avatar: {
            width: AVATAR_DIMENSIONS,
            height: AVATAR_DIMENSIONS
        },
        iconButton: {
            padding: 0
        },
        iconButtonsStack: {
            position: 'relative',
            top: `${ICON_BUTTONS_STACK_OFFSET_TOP}rem`,
            left: `${ICON_BUTTONS_STACK_OFFSET_LEFT}rem`
        }
    };
};

const UpdateOrDeleteAvatarButtonsStack = () => {
    const theme = useTheme();
    const styles = getProfilePageStyles(theme);
    const { deleteAvatarMutation } = useAvatar();

    return (
        <Stack sx={styles.iconButtonsStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
            <IconButton sx={styles.iconButton} onClick={() => console.log('Change avatar')}>
                <ChangeCircleIcon/>
            </IconButton>
            <IconButton sx={styles.iconButton} onClick={() => deleteAvatarMutation.mutate() }>
                <DeleteIcon/>
            </IconButton>
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

    const badgeContent = isPlaceHolderAvatar ? null : <UpdateOrDeleteAvatarButtonsStack/>;

    return (
        <Container sx={styles.container}>
            <Stack sx={styles.rootStack} direction={'column'} justifyContent={'center'}>
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