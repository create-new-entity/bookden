import { type SxProps, type Theme } from '@mui/material';

import { useBookTags } from '../../../hooks';
import type { BookSearchParams } from '../../../validations';
import { CustomMultiAutoComplete } from '../../custom';


type BookTagsSelectProps = {
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>) => void;
    multiAutoCompleteStyles?: SxProps<Theme>;
};

const BookTagsSelect = (props: BookTagsSelectProps) => {
    const { tags, updateParams, multiAutoCompleteStyles = {} } = props;
    const { data: allBookTags } = useBookTags();
    /*
        For this project, we don't really care about tagId at this point.
        It is good enough to have same tag value for both value and label.
    */
    const allBookTagsOptions = allBookTags?.map((tag) => ({ value: tag.tag, label: tag.tag })) || [];
    
    return (
        <CustomMultiAutoComplete<string>
            id='book-tags-input'
            multiAutoCompleteStyles={multiAutoCompleteStyles}
            label='Tags'
            placeholder='Search and select tags'
            options={allBookTagsOptions}
            value={tags}
            onChange={(value) => updateParams({ tags: value.join(',') })}
        />
    );
};

export default BookTagsSelect;