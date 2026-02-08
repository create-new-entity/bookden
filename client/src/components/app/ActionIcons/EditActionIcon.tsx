import EditSquareIcon from '@mui/icons-material/EditSquare';

import ActionIcon from './ActionIcon';


type EditActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
    testId?: string;
};

const EditActionIcon = (props: EditActionButtonProps) => {
    const { onClick, tooltipTitle, testId } = props;
    
    return (
        <ActionIcon
            icon={<EditSquareIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
            testId={testId}
        />
    );
};

export default EditActionIcon;