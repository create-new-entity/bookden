
import * as React from 'react';
import {
    Autocomplete, TextField,
    Chip, type SxProps, type Theme,
} from '@mui/material';

import type { MultiSelectOption } from '../../types';

type MultiValueInputProps<V extends string | number> = {
  id: string;
  label: string;
  placeholder?: string;

  options: MultiSelectOption<V>[];
  value: V[];
  onChange?: (value: V[]) => void;

  multiAutoCompleteStyles?: SxProps<Theme>;
  disabled?: boolean;
};

/* 
    Note to future self:

    Allow search and selection of multiple values from a predefined list of options.
    For example, a list of tags for a book.
*/

const MultiValueInput = <V extends string | number>(props: MultiValueInputProps<V>) => {
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

export default MultiValueInput;
