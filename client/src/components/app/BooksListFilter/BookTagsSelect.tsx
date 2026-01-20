import { type SxProps, type Theme } from '@mui/material';

import { useBookTags } from '../../../hooks';
import { MultiSelectAutoComplete } from '../../custom';


type BookTagsSelectProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
    multiAutoCompleteStyles?: SxProps<Theme>;
    label?: string;
    disabled?: boolean;
};

const BookTagsSelect = (props: BookTagsSelectProps) => {
    const { tags, onChange, multiAutoCompleteStyles = {}, label, disabled } = props;
    const { data: allBookTags } = useBookTags();
    /*
        For this project, we don't really care about tagId at this point.
        It is good enough to have same tag value for both value and label.
    */
    const allBookTagsOptions = allBookTags?.map((tag) => ({ value: tag.tag, label: tag.tag })) || [];
    
    return (
        <MultiSelectAutoComplete<string>
            id='book-tags-input'
            multiAutoCompleteStyles={multiAutoCompleteStyles}
            label={label ?? ''}
            placeholder='Search and select tags'
            options={allBookTagsOptions}
            value={tags}
            onChange={onChange}
            disabled={disabled}
        />
    );
};

export default BookTagsSelect;