

import type { SortOrder } from '../../types';
import {
    ASC,
    DESC,
    MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER,
} from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';
import type { UserSearchParams } from '../../validations/userSearchParams';


type SelectSortOrderProps = {
    sortOrder: SortOrder;
    updateParams: (params: Partial<UserSearchParams>) => void;
};


const SelectSortOrder = ({ sortOrder, updateParams }: SelectSortOrderProps) => {
    const options: Array<SelectOption<SortOrder>> = [
        { optionValue: ASC, optionLabel: 'Ascending' },
        { optionValue: DESC, optionLabel: 'Descending' },
    ];
    return (
        <CustomSelect<SortOrder>
            id="sort-order"
            formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER }}
            inputLabelText="Sort Order"
            value={sortOrder}
            onChange={(event) => {
                updateParams({ sortOrder: event.target.value });
            }}
            options={options}
        />
    );
};

export default SelectSortOrder;