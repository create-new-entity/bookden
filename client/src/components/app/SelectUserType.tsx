
import type { UserTypeOptions } from '../../types';
import { ADMIN, ALL, CUSTOMER, MINIMUM_WIDTH_FOR_SELECT_USER_TYPE } from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';
import type { UserSearchParams } from '../../validations/userSearchParams';


type SelectUserTypeProps = {
    userType: UserTypeOptions;
    updateParams: (params: Partial<UserSearchParams>) => void;
};


const SelectUserType = ({ userType, updateParams }: SelectUserTypeProps) => {
    const options: Array<SelectOption<UserTypeOptions>> = [
        { optionValue: ALL, optionLabel: 'All' },
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
                updateParams({ userType: event.target.value, page: 1 });
            }}
            options={options}
        />
    );
};

export default SelectUserType;