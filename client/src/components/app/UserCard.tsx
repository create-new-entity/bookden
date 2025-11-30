import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';

import type { User } from '../../types';
import { useAvatarBlob } from '../../hooks';
import { useTheme, type SxProps, type Theme } from '@mui/material/styles';

type Styles = {
    rootStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            paddingLeft: '10px'
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
        <Card>
            <Stack sx={styles.rootStack} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={'10px'}>
                {
                    objectUrl ? 
                        <CardMedia
                            component='img'
                            image={objectUrl}
                        />
                        :
                        <CardMedia component='img' />
                }
                <CardContent>
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