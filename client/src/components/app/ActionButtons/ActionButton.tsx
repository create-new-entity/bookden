import { IconButton, Tooltip } from '@mui/material';


type ActionButtonProps = {
    icon: React.ReactNode;
    onClick: () => void;
    tooltipTitle: string;
};


const ActionButton = (props: ActionButtonProps) => {
    const { icon, onClick, tooltipTitle } = props;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        /*
            Note to future self:
            Without the "preventDefault", app can go to wrong places, depending on the component.

            For example, the outer <Link> component consumes the click event on edit book
            button in book card component and then leads to the book view page instead
            of the book update page.
        */
        e.preventDefault();
        onClick();
    };

    return (
        <Tooltip title={tooltipTitle}>
            <IconButton onClick={handleClick}>
                {icon}
            </IconButton>
        </Tooltip>
    );
};

export default ActionButton;