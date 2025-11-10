import { Avatar, Container, Paper, Typography } from '@mui/material';
import useAvatarContext from '../contexts/AvatarContext';
import useAuthContext from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAvatar from '../hooks/useAvatar';

const AVATAR_DIMENSIONS = '15rem';

const ProfilePage = () => {
    const { avatarUrl } = useAvatarContext();
    const { username, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();

    useAvatar();
    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/auth');
        }
    }, [isLoggedIn, navigate]);

    return (
        <Container>
            <Paper elevation={2}>
                <Avatar sx={{ width: AVATAR_DIMENSIONS, height: AVATAR_DIMENSIONS }} alt={'Profile Avatar'} src={avatarUrl}/>
                <Typography>Username: {username}</Typography>
            </Paper>
        </Container>
    );
};

export default ProfilePage;