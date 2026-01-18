import ReplayIcon from '@mui/icons-material/Replay';

import ActionButton from './ActionButton';

type RestoreActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const RestoreActionButton = (props: RestoreActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionButton
            icon={<ReplayIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default RestoreActionButton;