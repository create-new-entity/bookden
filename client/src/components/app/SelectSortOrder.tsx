

import type { SortOrder } from '../../types';
import {
    ASC,
    DESC,
    MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER,
} from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';


type SelectSortOrderProps = {
    sortOrder: SortOrder;
    setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>;
};


const SelectSortOrder = ({ sortOrder, setSortOrder }: SelectSortOrderProps) => {
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
                setSortOrder(event.target.value);
            }}
            options={options}
        />
    );
};

export default SelectSortOrder;