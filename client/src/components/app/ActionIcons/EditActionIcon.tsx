import EditSquareIcon from '@mui/icons-material/EditSquare';

import ActionIcon from './ActionIcon';


type EditActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const EditActionIcon = (props: EditActionButtonProps) => {
    const { onClick, tooltipTitle } = props;
    
    return (
        <ActionIcon
            icon={<EditSquareIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default EditActionIcon;