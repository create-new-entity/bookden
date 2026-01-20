


import * as React from 'react';
import {
    Autocomplete,
    TextField,
    type AutocompleteProps,
    type SxProps,
    type Theme,
} from '@mui/material';

import type { SingleSelectOption } from '../../types';

type CustomSingleAutoCompleteProps<V extends string | number> = {
  id: string;
  label?: string;
  placeholder?: string;

  options: SingleSelectOption<V>[];
  value?: V;
  onChange?: (value: V | undefined) => void;

  sx?: SxProps<Theme>;
  disabled?: boolean;
} & Omit<
  AutocompleteProps<
    SingleSelectOption<V>,
    false, // single select
    false, // clearable
    false  // no freeSolo
  >,
  'options' | 'value' | 'onChange' | 'renderInput'
>;


/*
    Force a single selection and allow typing to search from a predefined list of options.
    For example, a language selection for a book.
*/
const SingleSelectAutoComplete = <V extends string | number>(
    props: CustomSingleAutoCompleteProps<V>
) => {
    const {
        id, label, placeholder,
        options, value, onChange,
        sx, disabled = false,
        ...rest
    } = props;

    const selectedOption = React.useMemo(
        () => options.find((o) => o.value === value) ?? null,
        [options, value]
    );

    return (
        <Autocomplete
            {...rest}
            id={`single-autocomplete-${id}`}
            options={options}
            value={selectedOption}
            disabled={disabled}
            sx={sx}
            isOptionEqualToValue={(opt, val) => opt.value === val.value}
            getOptionLabel={(opt) => opt.label}
            onChange={(_event, option) => {
                onChange?.(option?.value);
            }}
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

export default SingleSelectAutoComplete;
