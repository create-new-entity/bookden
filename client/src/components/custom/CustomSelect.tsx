import { MenuItem, type SelectChangeEvent, type SxProps, type Theme } from '@mui/material';
import { FormControl, InputLabel, Select } from '@mui/material';

export type SelectOption<V extends string | number> = {
    optionValue: V;
    optionLabel: string;
};

type CustomSelectProps<V extends string | number> = {
    id?: string;
    formControlSx?: SxProps<Theme>;
    inputLabelText: string;
    value: V;
    onChange: (event: SelectChangeEvent<V>) => void;
    options: SelectOption<V>[];
};


const CustomSelect = <V extends string | number>(props: CustomSelectProps<V>) => {
    const { id, formControlSx, inputLabelText, value, onChange, options } = props;

    return (
        <FormControl sx={formControlSx}>
            <InputLabel id={`select-${id}-label`}>{inputLabelText}</InputLabel>
            <Select
                labelId={`select-${id}-label`}
                id={`select-${id}`}
                value={value}
                label={inputLabelText}
                onChange={onChange}
            >
                {
                    options.map((option, index) => (
                        <MenuItem key={`select-${option.optionLabel}-${index}`} value={option.optionValue}>
                            {option.optionLabel}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
};

export default CustomSelect;