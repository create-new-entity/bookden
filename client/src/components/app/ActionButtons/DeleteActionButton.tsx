import DeleteIcon from '@mui/icons-material/Delete';

import ActionButton from './ActionButton';

type DeleteActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const DeleteActionButton = (props: DeleteActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionButton
            icon={<DeleteIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default DeleteActionButton;