import AddCircleIcon from '@mui/icons-material/AddCircle';

import ActionIcon from './ActionIcon';


type AddActionIconProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const AddActionIcon = (props: AddActionIconProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<AddCircleIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default AddActionIcon;