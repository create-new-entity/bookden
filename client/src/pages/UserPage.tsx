import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
    Avatar,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    IconButton,
    Typography,
    useTheme,
    type SxProps,
    type Theme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { getUser } from '../api/users';
import { useAuthContext, useNotificationContext } from '../contexts';
import { useAvatarBlob } from '../hooks';
import { AVATAR_DIMENSIONS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR, PLACE_HOLDER_AVATAR } from '../constants';
import { UserTypeChip } from '../components/app';
import { deleteUser } from '../api';

type Styles = {
    rootStack: SxProps<Theme>;
    paper: SxProps<Theme>;
    avatar: SxProps<Theme>;
    containerStack: SxProps<Theme>;
    chipStack: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        paper: {
            width: '90%'
        },
        avatar: {
            [theme.breakpoints.up('sm')]: {
                width: `${AVATAR_DIMENSIONS}px`,
                height: `${AVATAR_DIMENSIONS}px`,
            },

            [theme.breakpoints.up('md')]: {
                width: `${AVATAR_DIMENSIONS * 2}px`,
                height: `${AVATAR_DIMENSIONS * 2}px`,
            },

            [theme.breakpoints.up('lg')]: {
                width: `${AVATAR_DIMENSIONS * 2.5}px`,
                height: `${AVATAR_DIMENSIONS * 2.5}px`,
            }
        },
        containerStack: {
            padding: '30px'
        },
        chipStack: {
            height: '40px'
        }
    };
};

const UserPage = () => {
    const { userId } = useParams();
    const { token } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();
    const theme = useTheme();
    const styles = getStyles(theme);

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUser(parseInt(userId || '-1', 10), token),
    });
    const queryClient = useQueryClient();

    const { objectUrl: avatarBlobUrl } = useAvatarBlob(user?.userId || -1);

    const handleDeleteUser = async () => {
        if(user) {
            await deleteUser(token, user.userId);
            handleShowNotification('User deleted successfully.');
            queryClient.invalidateQueries({ queryKey: ['usersList'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
        }
    };

    return (
        <>
            {
                isLoading || !user
                    ?
                    <CircularProgress />
                    :
                    <Stack sx={styles.rootStack} direction={'column'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                        <Paper sx={styles.paper}>
                            <Stack sx={styles.containerStack} direction={'row'} justifyContent={'center'} alignItems={'center'} gap={`${DEFAULT_GAP * 10}px`}>
                                <Avatar sx={styles.avatar} src={avatarBlobUrl || PLACE_HOLDER_AVATAR} />
                                <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                                    <Typography variant='body1'>{user.username}</Typography>
                                    <Typography variant='body1'>{user.email}</Typography>
                                    <Stack sx={styles.chipStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                                        <UserTypeChip userType={user.userType} />
                                        {
                                            user.deletedAt &&
                                            <Chip label='Deleted' color='error' size='small' />
                                        }
                                        {
                                            !user.deletedAt &&
                                            <IconButton onClick={handleDeleteUser}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    </Stack>
                                    <Typography variant='body1'>Created At: {user.createdAt}</Typography>
                                    <Typography variant='body1'>Updated At: {user.updatedAt}</Typography>
                                    <Typography variant='body1'>Deleted At: {user.deletedAt}</Typography>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Stack>
            }
        </>
    );
};

export default UserPage;