import { Autocomplete, IconButton, TextField, type AutocompleteProps, type SxProps, type Theme } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { isString } from '../../types';
import { MAX_NUMBER_OF_RECENT_SEARCH_VALUES } from '../../constants';


type CustomAutoCompleteProps = {
    id: string;
    sx?: SxProps<Theme>;
    handleChange: (value: string) => void;
} & Omit<AutocompleteProps<
        string, // Type of the option
        false,   // Multi selection not allowed
        false,   // Input can be cleared by the user
        true     // User can type whatever in the input
    >, 'renderInput' | 'options'>;


const CustomAutoComplete = (props: CustomAutoCompleteProps) => {
    const [previouslySearchedValues, setPreviouslySearchedValues] = useLocalStorage<string[]>(props.id, []);
    const { handleChange } = props;

    const save = (value: string) => {
        handleChange(value);
        if(!value) {
            return;
        }
        setPreviouslySearchedValues((prevValues) => {
            if(prevValues.includes(value)) {
                return prevValues;
            }
            return [value, ...prevValues].slice(0, MAX_NUMBER_OF_RECENT_SEARCH_VALUES);
        });
    };
    
    return (
        <Autocomplete
            id={`autocomplete-${props.id}`}
            sx={props.sx}
            value={props.value}
            options={previouslySearchedValues}
            filterOptions={(options, state) => {
                return options.filter((option) => {
                    return option.toLowerCase().includes(state.inputValue.toLowerCase());
                });
            }}
            clearIcon={<ClearIcon onClick={() => save('')} fontSize='small'/>}
            renderInput={(params) => {
                return <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: <IconButton><SearchIcon/></IconButton>
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.stopPropagation();
                            if(isString(params.inputProps.value)) {
                                save(params.inputProps.value);
                            }
                        }
                    }}
                />;
            }}
            autoSelect={true}
            onChange={(_event, value) => {
                if(value) {
                    save(value);
                }
            }}
        />
    );
};

export default CustomAutoComplete;