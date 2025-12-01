import { Chip } from '@mui/material';

import { USERTYPE_CHIP_COLORS, USERTYPE_LABELS } from '../../constants';
import type { UserType } from '../../types';


type UserTypeChipProps = {
    userType: UserType;
};

const UserTypeChip = ({ userType }: UserTypeChipProps) => {
    return (
        <Chip sx={{ backgroundColor: USERTYPE_CHIP_COLORS[userType] }} label={USERTYPE_LABELS[userType]} size='small' />
    );
};

export default UserTypeChip;