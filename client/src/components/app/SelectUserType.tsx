
import type { UserTypeOptions } from '../../types';
import { ADMIN, CUSTOMER, MINIMUM_WIDTH_FOR_SELECT_USER_TYPE } from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';


type SelectUserTypeProps = {
    userType: UserTypeOptions;
    setUserType: React.Dispatch<React.SetStateAction<UserTypeOptions>>;
};


const SelectUserType = ({ userType, setUserType }: SelectUserTypeProps) => {
    const options: Array<SelectOption<UserTypeOptions>> = [
        { optionValue: 'all', optionLabel: 'All' },
        { optionValue: CUSTOMER, optionLabel: 'Customer' },
        { optionValue: ADMIN, optionLabel: 'Admin' },
    ];
    return (
        <CustomSelect<UserTypeOptions>
            id="user-type"
            formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_SELECT_USER_TYPE }}
            inputLabelText="User Type"
            value={userType}
            onChange={(event) => {
                setUserType(event.target.value);
            }}
            options={options}
        />
    );
};

export default SelectUserType;