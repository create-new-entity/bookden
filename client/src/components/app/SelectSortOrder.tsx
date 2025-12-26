

import type { SortOrder } from '../../types';
import {
    ASC,
    DESC,
    MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER,
} from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';
import type { SelectChangeEvent } from '@mui/material';


type SelectSortOrderProps = {
    sortOrder: SortOrder;
    onChange: (event: SelectChangeEvent<SortOrder>) => void;
};


const SelectSortOrder = ({ sortOrder, onChange }: SelectSortOrderProps) => {
    const options: Array<SelectOption<SortOrder>> = [
        { optionValue: ASC, optionLabel: 'Ascending' },
        { optionValue: DESC, optionLabel: 'Descending' },
    ];
    return (
        <CustomSelect<SortOrder>
            id='sort-order'
            data-testid='sort-order-select'
            formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_SELECT_SORT_ORDER }}
            inputLabelText="Sort Order"
            value={sortOrder}
            onChange={onChange}
            options={options}
        />
    );
};

export default SelectSortOrder;