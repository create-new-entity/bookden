import DeleteIcon from '@mui/icons-material/Delete';

import ActionIcon from './ActionIcon';

type DeleteActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const DeleteActionIcon = (props: DeleteActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<DeleteIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default DeleteActionIcon;