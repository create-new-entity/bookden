import { Autocomplete, IconButton, TextField, type AutocompleteProps, type SxProps, type Theme } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';
import SearchIcon from '@mui/icons-material/Search';

import { isString } from '../../types';
import { MAX_NUMBER_OF_RECENT_SEARCH_VALUES } from '../../constants';


type CustomAutoCompleteProps = {
    id: string;
    sx?: SxProps<Theme>;
} & Omit<AutocompleteProps<
        string, // Type of the option
        false,   // Multi selection not allowed
        false,   // Input can be cleared by the user
        true     // User can type whatever in the input
    >, 'renderInput' | 'options'>;


const CustomAutoComplete = (props: CustomAutoCompleteProps) => {
    const [previouslySearchedValues, setPreviouslySearchedValues] = useLocalStorage<string[]>(props.id, []);
    
    return (
        <Autocomplete
            {...props}
            clearOnBlur={false}
            options={previouslySearchedValues}
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
                            setPreviouslySearchedValues((prevValues) => {
                                if(params.inputProps.value && isString(params.inputProps.value)) {
                                    return [params.inputProps.value,...prevValues].slice(0, MAX_NUMBER_OF_RECENT_SEARCH_VALUES);
                                }
                                return [...prevValues];
                            });
                        }
                    }}
                />;
            }}
        />
    );
};

export default CustomAutoComplete;