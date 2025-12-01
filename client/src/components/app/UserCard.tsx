import { Box, Card, CardContent, CardMedia, Stack, Typography, Chip, IconButton } from '@mui/material';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import type { User } from '../../types';
import { useAvatarBlob } from '../../hooks';
import { BORDER_RADIUS, DEFAULT_GAP } from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { deleteUser } from '../../api/profile';
import UserTypeChip from './UserTypeChip';


type Styles = {
    rootStack: SxProps<Theme>;
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        card: {
            backgroundColor: theme.palette.primary.light,
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
            width: '100px',
            height: '100px',
            borderRadius: BORDER_RADIUS,
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        },
        cardContent: {
            flex: 1
        }
    };
};


type UserCardProps = {
    item: User;
    onItemDelete?: () => void;
};

const UserCard = ({ item, onItemDelete }: UserCardProps) => {
    const user = item;
    const { objectUrl } = useAvatarBlob(user.userId);
    const { token } = useAuthContext();
    const theme = useTheme();
    const styles = getStyles(theme);
    const { handleShowNotification } = useNotificationContext();
    const isAlreadyDeleted = user.deletedAt !== null;

    const handleDeleteUser = async () => {
        await deleteUser(token, user.userId);
        onItemDelete?.();
        handleShowNotification('User deleted successfully.');
    };

    return (
        <Link to={`/users/${user.userId}`}>
            <Card sx={styles.card}>
                <Stack sx={styles.rootStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={'15px'}>
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