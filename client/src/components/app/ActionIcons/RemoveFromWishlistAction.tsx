

import FavoriteIcon from '@mui/icons-material/Favorite';

import ActionIcon from './ActionIcon';

type RemoveFromWishlistActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const RemoveFromWishlistActionIcon = (props: RemoveFromWishlistActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<FavoriteIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default RemoveFromWishlistActionIcon;