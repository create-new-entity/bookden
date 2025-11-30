import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';

import type { User } from '../../types';
import { useAvatarBlob } from '../../hooks';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';

type Styles = {
    rootStack: SxProps<Theme>;
    card: SxProps<Theme>;
    cardMedia: SxProps<Theme>;
    cardContent: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            paddingLeft: '10px',
            height: '100%'
        },
        card: {
            height: '10rem',
            width: '25rem'
        },
        cardMedia: {
            width: '6rem',
            height: '6rem',
            borderRadius: '50%',
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
};

const UserCard = ({ item }: UserCardProps) => {
    const user = item;
    const { objectUrl } = useAvatarBlob(user.userId);
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
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
                    <Typography variant='h6'>{user.username}</Typography>
                    <Typography variant='body1'>{user.email}</Typography>
                    <Typography variant='body1'>{user.userType}</Typography>
                    <Typography variant='body1'>{user.createdAt}</Typography>
                </CardContent>
            </Stack>
        </Card>
    );
};

export default UserCard;