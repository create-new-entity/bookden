import { Add } from '@mui/icons-material';

import ActionIcon from './ActionIcon';


type AddActionIconProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const AddActionIcon = (props: AddActionIconProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<Add />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default AddActionIcon;