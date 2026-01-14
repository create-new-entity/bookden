import { IconButton, Tooltip } from '@mui/material';


type ActionButtonProps = {
    icon: React.ReactNode;
    onClick: () => void;
    tooltipTitle: string;
};


const ActionButton = (props: ActionButtonProps) => {
    const { icon, onClick, tooltipTitle } = props;
    
    return (
        <Tooltip title={tooltipTitle}>
            <IconButton onClick={onClick}>
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export default ActionButton;