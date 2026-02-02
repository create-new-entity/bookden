import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Avatar,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Typography,
    useTheme,
    type SxProps,
    type Theme,
    Box
} from '@mui/material';

import { getUser } from '../api/users';
import { useAuthContext, useNotificationContext } from '../contexts';
import { useBlobImage } from '../hooks';
import { AUTH, AVATAR_DIMENSIONS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR, PLACE_HOLDER_AVATAR, UNAUTHORIZED_STATUS_CODE } from '../constants';
import { UserTypeChip } from '../components/app';
import { getUserAvatarBlob } from '../api';
import { getFormattedDate } from '../utility';
import RestoreActionButton from '../components/app/ActionIcons/RestoreActionButton';
import { useRestoreUser } from '../hooks/useRestoreUser';
import DeleteActionIcon from '../components/app/ActionIcons/DeleteActionIcon';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { useEffect } from 'react';
import type { AxiosErrorResponse, User } from '../types';

type Styles = {
    rootStack: SxProps<Theme>;
    paper: SxProps<Theme>;
    avatar: SxProps<Theme>;
    containerStack: SxProps<Theme>;
    chipStack: SxProps<Theme>;
    detailsStack: SxProps<Theme>;
    textContainer: SxProps<Theme>;
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
            [theme.breakpoints.down('sm')]: {
                width: `${AVATAR_DIMENSIONS * 0.5}px`,
                height: `${AVATAR_DIMENSIONS * 0.5}px`,
            },
            [theme.breakpoints.between('sm', 'md')]: {
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
        },
        detailsStack: {
            flexGrow: 1
        },
        textContainer: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
};

const UserPage = () => {
    const { userId } = useParams();
    const parsedUserId = Number(userId);
    const { token } = useAuthContext();
    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const { handleShowNotification } = useNotificationContext();

    const { data: user, isLoading, isFetched, isError, error } = useQuery<User, AxiosErrorResponse>({
        queryKey: ['user', parsedUserId],
        queryFn: () => getUser(parsedUserId, token),
        retry: false,
        enabled: !!token,
    });

    useEffect(() => {
        const shouldLoginAgain = isFetched && isError && error?.response?.status === UNAUTHORIZED_STATUS_CODE;
        if(shouldLoginAgain) {
            handleShowNotification('Session expired or user deleted. Please log in again.');
            navigate(AUTH);
        }
    }, [isFetched, isError, error, navigate, handleShowNotification]);

    const blobOptions = {
        queryKey: ['avatar', token, user?.userId],
        queryFn: () => getUserAvatarBlob(token, user?.userId || -1),
        enabled: !!token && !!user?.userId,
    };

    const { objectUrl: avatarBlobUrl } = useBlobImage(blobOptions);
    const { restoreUserMutation } = useRestoreUser(parsedUserId);
    const { deleteUserMutation } = useDeleteUser(parsedUserId);

    const handleDeleteUser = () => {
        deleteUserMutation.mutate();
    };

    const handleRestoreUser = () => {
        restoreUserMutation.mutate();
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
                            <Stack sx={styles.containerStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP * 2}px`}>
                                <Avatar sx={styles.avatar} src={avatarBlobUrl || PLACE_HOLDER_AVATAR} />
                                <Stack sx={styles.detailsStack} direction={'row'} justifyContent={'center'} alignItems={'center'}>
                                    <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                                        <Box sx={styles.textContainer}>
                                            <Typography variant='h4'>{user.username}</Typography>
                                            <Typography variant='body1'>{user.email}</Typography>
                                        </Box>
                                        <Stack sx={styles.chipStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                                            <UserTypeChip userType={user.userType} />
                                            {
                                                user.deletedAt &&
                                                <Chip label='Deleted' color='error' size='small' />
                                            }
                                            {
                                                !user.deletedAt &&
                                                <DeleteActionIcon
                                                    onClick={handleDeleteUser}
                                                    tooltipTitle='Delete User'
                                                />
                                            }
                                            {
                                                user.deletedAt &&
                                                <RestoreActionButton
                                                    onClick={handleRestoreUser}
                                                    tooltipTitle='Restore User'
                                                />
                                            }
                                        </Stack>
                                        <Box sx={styles.textContainer}>
                                            <Typography variant='body1'>Created At: {getFormattedDate(new Date(user.createdAt))}</Typography>
                                            {
                                                user.updatedAt &&
                                                <Typography variant='body1'>Updated At: {getFormattedDate(new Date(user.updatedAt))}</Typography>
                                            }
                                            {
                                                user.deletedAt &&
                                                <Typography variant='body1'>Deleted At: {getFormattedDate(new Date(user.deletedAt))}</Typography>
                                            }
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Stack>
            }
        </>
    );
};

export default UserPage;