
import {
    Autocomplete,
    Chip,
    TextField,
    type SxProps,
    type Theme,
} from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';

import { MAX_NUMBER_OF_RECENT_SEARCH_VALUES } from '../../constants';
import { isString } from '../../types/LogIn';

type MultiValueInputProps = {
  id: string;
  label?: string;
  placeholder?: string;

  value: string[];
  onChange: (value: string[]) => void;

  sx?: SxProps<Theme>;
  disabled?: boolean;
};



/*
    Note to future self:

    Use case: Freely type in and allow multiple values.
    Show recently searched values as dropdown options.

    For example, A list of authors for a book.
    We don't save authors in a separate table and keep it
    loose and dynamic for authors field. In this case,
    MultiValueFreeInput is good enough.
*/
const MultiValueFreeInput = (props: MultiValueInputProps) => {
    const [previouslySearchedValues, setPreviouslySearchedValues] = useLocalStorage<string[]>(props.id, []);

    const {
        id, label, placeholder,
        value, onChange, sx,
        disabled = false
    } = props;

    const handleLocalStorageStateUpdate = (newValue: string[]) => {
        setPreviouslySearchedValues((prevValues) => {
            const allValuesAlreadyExist = newValue.every(value => prevValues.includes(value));
            if(allValuesAlreadyExist) {
                return prevValues;
            }
            return [...new Set([...newValue, ...prevValues])].slice(0, MAX_NUMBER_OF_RECENT_SEARCH_VALUES);
        });
    };

    return (
        <Autocomplete
            id={`multi-value-input-${id}`}
            multiple
            freeSolo
            disabled={disabled}
            options={previouslySearchedValues}
            value={value}
            sx={sx}
            isOptionEqualToValue={(option, value) => option === value}

            onChange={(_event, newValue) => {
                const normalized = newValue
                    .map(v => v.trim())
                    .filter(Boolean);
                onChange(normalized);
                handleLocalStorageStateUpdate(normalized);
            }}

            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                    const newValue = (e.target as HTMLInputElement).value;
                    if(isString(newValue)) {
                        const uniqueValues = [...new Set([newValue, ...value])].map(v => v.trim()).filter(Boolean);
                        onChange(uniqueValues);
                        handleLocalStorageStateUpdate(uniqueValues);
                    }
                }
            }}

            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        {...getTagProps({ index })}
                        key={`${option}-${index}`}
                        label={option}
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

export default MultiValueFreeInput;
