
import * as React from 'react';
import {
    Autocomplete, TextField,
    Chip, type SxProps, type Theme,
} from '@mui/material';

import type { MultiSelectOption } from '../../types';

type CustomMultiAutoCompleteProps<V extends string | number> = {
  id: string;
  label: string;
  placeholder?: string;

  options: MultiSelectOption<V>[];
  value: V[];
  onChange?: (value: V[]) => void;

  multiAutoCompleteStyles?: SxProps<Theme>;
  disabled?: boolean;
};


const CustomMultiAutoComplete = <V extends string | number>(props: CustomMultiAutoCompleteProps<V>) => {
    const {
        id, label, placeholder,
        options, value, onChange,
        multiAutoCompleteStyles = {}, disabled = false,
    } = props;

    const selectedOptions = React.useMemo(
        () => options.filter(o => value.includes(o.value)),
        [options, value]
    );

    return (
        <Autocomplete
            id={`multi-autocomplete-${id}`}
            multiple
            disableCloseOnSelect
            options={options}
            value={selectedOptions}
            disabled={disabled}
            sx={multiAutoCompleteStyles}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            getOptionLabel={(opt) => opt.label}
            onChange={(_event, selected) => {
                onChange?.(selected.map(o => o.value));
            }}
            renderValue={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        {...getTagProps({ index })}
                        key={option.value}
                        label={option.label}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                />
            )}
        />
    );
};

export default CustomMultiAutoComplete;
