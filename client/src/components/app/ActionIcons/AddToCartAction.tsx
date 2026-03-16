import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import ActionIcon from './ActionIcon';

type AddToCartActionProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const AddToCartAction = (props: AddToCartActionProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<AddShoppingCartIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default AddToCartAction;