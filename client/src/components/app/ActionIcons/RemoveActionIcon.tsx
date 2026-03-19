import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

import ActionIcon from './ActionIcon';


type RemoveActionIconProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const RemoveActionIcon = (props: RemoveActionIconProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<RemoveCircleIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default RemoveActionIcon;