import { Box, Card, CardContent, CardMedia, Stack, Typography, Chip, IconButton } from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import type { User } from '../../types';
import { useBlobImage } from '../../hooks';
import { BORDER_RADIUS, DEFAULT_GAP } from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { deleteUser, getUserAvatarBlob } from '../../api';
import UserTypeChip from './UserTypeChip';


type Styles = {
    rootStack: SxProps<Theme>;
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
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
            '& .MuiIconButton-root': {
                display: 'none',
                padding: 0
            },
            '&:not(:hover) .MuiIconButton-root': {
                display: 'none'
            },
            '&:hover .MuiIconButton-root': {
                display: 'block'
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
        }
    };
};


type UserCardProps = {
    item: User;
    onItemDelete?: () => void;
};

const UserCard = ({ item, onItemDelete }: UserCardProps) => {
    const user = item;
    const { token } = useAuthContext();
    const theme = useTheme();
    const styles = getStyles(theme);
    const { handleShowNotification } = useNotificationContext();
    const blobOptions = {
        queryKey: ['avatar', token, user.userId],
        queryFn: () => getUserAvatarBlob(token, user.userId),
        enabled: !!token && !!user.userId,
    };
    const { objectUrl } = useBlobImage(blobOptions);
    const isAlreadyDeleted = user.deletedAt !== null;

    const handleDeleteUser = async () => {
        await deleteUser(token, user.userId);
        onItemDelete?.();
        handleShowNotification('User deleted successfully.');
    };

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
                            <Typography variant='h6'>{user.username}</Typography>
                            {
                                !isAlreadyDeleted &&
                                <IconButton onClick={handleDeleteUser}><DeleteIcon /></IconButton>
                            }
                        </Stack>
                        <Typography variant='body1'>{user.email}</Typography>
                        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                            <UserTypeChip userType={user.userType} />
                            {
                                user.deletedAt &&
                                <Chip label='Deleted' color='error' size='small' />
                            }
                        </Stack>
                        <Typography variant='body1'>{user.createdAt}</Typography>
                    </CardContent>
                </Stack>
            </Card>
        </Link>
    );
};

export default UserCard;