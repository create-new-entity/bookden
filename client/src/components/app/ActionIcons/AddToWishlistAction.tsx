

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ActionIcon from './ActionIcon';

type AddToWishlistActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const AddToWishlistActionIcon = (props: AddToWishlistActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<FavoriteBorderIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default AddToWishlistActionIcon;