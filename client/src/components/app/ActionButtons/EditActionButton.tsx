import EditSquareIcon from '@mui/icons-material/EditSquare';

import ActionButton from './ActionButton';



type EditActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const EditActionButton = (props: EditActionButtonProps) => {
    const { onClick, tooltipTitle } = props;
    
    return (
        <ActionButton
            icon={<EditSquareIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default EditActionButton;