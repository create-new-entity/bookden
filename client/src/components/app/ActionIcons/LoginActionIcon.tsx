import LoginIcon from '@mui/icons-material/Login';

import ActionIcon from './ActionIcon';

type LoginActionButtonProps = {
    onClick: () => void;
    tooltipTitle: string;
};

const LoginActionIcon = (props: LoginActionButtonProps) => {
    const { onClick, tooltipTitle } = props;

    return (
        <ActionIcon
            icon={<LoginIcon />}
            onClick={onClick}
            tooltipTitle={tooltipTitle}
        />
    );
};

export default LoginActionIcon;