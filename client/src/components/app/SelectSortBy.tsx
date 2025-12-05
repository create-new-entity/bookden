
import type { SortByOptions } from '../../types';
import {
    CREATED_AT,
    DELETED_AT,
    EMAIL,
    MINIMUM_WIDTH_FOR_SELECT_SORT_BY,
    UPDATED_AT,
    USERNAME,
    USERS_LIST_SORT_BY_OPTIONS_TEXTS
} from '../../constants';
import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';
import type { UserSearchParams } from '../../validations/userSearchParams';


type SelectSortByProps = {
    sortBy: SortByOptions;
    updateParams: (params: Partial<UserSearchParams>) => void;
};


const SelectSortBy = ({ sortBy, updateParams }: SelectSortByProps) => {
    const options: Array<SelectOption<SortByOptions>> = [
        { optionValue: USERNAME, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[USERNAME] },
        { optionValue: EMAIL, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[EMAIL] },
        { optionValue: CREATED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[CREATED_AT] },
        { optionValue: UPDATED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[UPDATED_AT] },
        { optionValue: DELETED_AT, optionLabel: USERS_LIST_SORT_BY_OPTIONS_TEXTS[DELETED_AT] },
    ];
    return (
        <CustomSelect<SortByOptions>
            id="sort-by"
            formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_SELECT_SORT_BY }}
            inputLabelText="Sort By"
            value={sortBy}
            onChange={(event) => {
                updateParams({ sortBy: event.target.value, page: 1 });
            }}
            options={options}
        />
    );
};

export default SelectSortBy;