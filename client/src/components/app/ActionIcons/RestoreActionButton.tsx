import ReplayIcon from '@mui/icons-material/Replay';

import ActionIcon from './ActionIcon';

type RestoreActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const RestoreActionButton = (props: RestoreActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<ReplayIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default RestoreActionButton;