import { Card, CardContent, CardMedia } from '@mui/material';
import type { User } from '../../types';


type UserCardProps = {
    user: User;
};

const UserCard = ({ user }: UserCardProps) => {
    return (
        <Card>
            <CardMedia></CardMedia>
            <CardContent></CardContent>
        </Card>
    );
};

export default UserCard;