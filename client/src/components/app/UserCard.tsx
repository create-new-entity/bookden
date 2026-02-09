


import { Box, Card, CardContent, CardMedia, Stack, Typography, Chip, Tooltip } from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

import type { User } from '../../types';
import { useBlobImage } from '../../hooks';
import { BORDER_RADIUS, DEFAULT_GAP } from '../../constants';
import { useAuthContext } from '../../contexts';
import { getUserAvatarBlob } from '../../api';
import UserTypeChip from './UserTypeChip';
import { getFormattedDate } from '../../utility';
import DeleteActionIcon from './ActionIcons/DeleteActionIcon';
import { useRestoreUser } from '../../hooks/useRestoreUser';
import RestoreActionButton from './ActionIcons/RestoreActionButton';
import { useDeleteUser } from '../../hooks/useDeleteUser';


type Styles = {
    rootStack: SxProps<Theme>;
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
    overflow: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    const rootStackPaddingLeft = '10px';
    const rootStacDefaultGap = `${DEFAULT_GAP}px`;
    const IMAGE_WIDTH_HEIGHT = '100px';

    return {
        card: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            '& .user-card-actions': {
                opacity: 0,
                pointerEvents: 'none',
                transition: 'opacity 0.15s ease-in-out'
            },
            '&:hover .user-card-actions': {
                opacity: 1,
                pointerEvents: 'auto'
            }
        },
        rootStack: {
            paddingLeft: '10px',
            height: '100%'
        },
        cardMedia: {
            width: IMAGE_WIDTH_HEIGHT,
            height: IMAGE_WIDTH_HEIGHT,
            borderRadius: BORDER_RADIUS,
            '& img': {
                width: IMAGE_WIDTH_HEIGHT,
                height: IMAGE_WIDTH_HEIGHT,
                objectFit: 'cover'
            }
        },
        cardContent: {
            flex: 1,
            maxWidth: `calc(100% - ${IMAGE_WIDTH_HEIGHT} - ${rootStackPaddingLeft} - ${rootStacDefaultGap})`,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0
        },
        overflow: {
            width: '95%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
};


type UserCardProps = {
    item: User;
};

const UserCard = ({ item }: UserCardProps) => {
    const user = item;
    const { token } = useAuthContext();
    const theme = useTheme();
    const styles = getStyles(theme);
    const blobOptions = {
        queryKey: ['avatar', token, user.userId],
        queryFn: () => getUserAvatarBlob(token, user.userId),
        enabled: !!token && !!user.userId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const { restoreUserMutation } = useRestoreUser(user.userId);
    const { deleteUserMutation } = useDeleteUser(user.userId);

    const handleRestoreUser = () => {
        restoreUserMutation.mutate();
    };

    const isDeleted = user.deletedAt !== null;

    const handleDeleteUser = () => {
        deleteUserMutation.mutate();
    };

    const createdAt = getFormattedDate(new Date(user.createdAt));

    return (
        <Link to={`/users/${user.userId}`}>
            <Card sx={styles.card} data-testid={'user-card'}>
                <Stack sx={styles.rootStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                    {
                        objectUrl ? 
                            <Box sx={styles.cardMedia}>
                                <CardMedia
                                    sx={styles.cardMedia}
                                    component='img'
                                    image={objectUrl}
                                />
                            </Box>
                            :
                            <CardMedia
                                sx={styles.cardMedia}
                                component='img'
                            />
                    }
                    <CardContent sx={styles.cardContent}>
                        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                            <Tooltip title={user.username} placement='bottom-start'>
                                <Typography sx={styles.overflow} variant='h6'>{user.username}</Typography>
                            </Tooltip>
                            <Box className='user-card-actions'>
                                {
                                    !isDeleted &&
                                    <DeleteActionIcon
                                        onClick={handleDeleteUser}
                                        tooltipTitle='Delete User'
                                    />
                                }
                                {
                                    isDeleted &&
                                    <RestoreActionButton
                                        onClick={handleRestoreUser}
                                        tooltipTitle='Restore User'
                                    />
                                }
                            </Box>
                        </Stack>
                        <Tooltip title={user.email} placement='bottom-start'>
                            <Typography sx={styles.overflow} variant='body1'>{user.email}</Typography>
                        </Tooltip>
                        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                            <UserTypeChip userType={user.userType} />
                            {
                                user.deletedAt &&
                                <Chip label='Deleted' color='error' size='small' />
                            }
                        </Stack>
                        <Tooltip title={`Created on ${createdAt}`} placement='bottom-start'>
                            <Typography sx={styles.overflow} variant='body1'>Created on {createdAt}</Typography>
                        </Tooltip>
                    </CardContent>
                </Stack>
            </Card>
        </Link>
    );
};

export default UserCard;