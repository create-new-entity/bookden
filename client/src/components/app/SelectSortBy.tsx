import type { SelectChangeEvent, SxProps, Theme } from '@mui/material';

import type { SelectOption } from '../custom/CustomSelect';
import { CustomSelect } from '../custom';



// Check the comment about this "extends" just above SelectOption type definition in CustomSelect.tsx.
type SelectSortByProps<TValue extends string | number> = {
    id: string;
    value: TValue;
    options: Array<SelectOption<TValue>>;
    formControlSx?: SxProps<Theme>;
    onChange: (event: SelectChangeEvent<TValue>) => void;
  };


const SelectSortBy = <TValue extends string | number>(props: SelectSortByProps<TValue>) => {
    const { id, value, options, formControlSx, onChange } = props;
    
    return (
        <CustomSelect<TValue>
            id={id}
            formControlSx={formControlSx}
            inputLabelText="Sort By"
            value={value}
            onChange={onChange}
            options={options}
        />
    );
};

export default SelectSortBy;