
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import ActionIcon from './ActionIcon';

type RemoveFromCartActionProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const RemoveFromCartAction = (props: RemoveFromCartActionProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<RemoveShoppingCartIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default RemoveFromCartAction;