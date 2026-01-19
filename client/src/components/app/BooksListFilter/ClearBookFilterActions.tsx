import { Button, Stack, Typography } from '@mui/material';

import { DEFAULT_GAP } from '../../../constants';
import type { BookSearchParams, BookSearchParamsWithTagsArray } from '../../../validations';
import type { UpdateMode } from '../../../hooks';


type ClearBookFilterActionsProps = {
    tags: string[];
    priceMin: BookSearchParams['priceMin'];
    priceMax: BookSearchParams['priceMax'];
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>, mode: UpdateMode) => void;
};


const ClearBookFilterActions = (props: ClearBookFilterActionsProps) => {
    const { tags, priceMin, priceMax, params, updateParams } = props;

    const clearTags = () => {
        updateParams({ tags: '' }, 'merge');
    };

    const clearPrice = () => {
        const newParams = { ...params, tags: params.tags.join(',') };
        delete newParams.priceMin;
        delete newParams.priceMax;
        updateParams(newParams, 'replace');
    };

    const clearAll = () => {
        updateParams({}, 'replace');
    };

    const hasPrice = priceMin !== undefined || priceMax !== undefined;

    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap={`${DEFAULT_GAP / 4}px`}
        >
            {
                tags.length > 0
                    ?
                    (
                        <>
                            <Typography variant='subtitle1'>{tags.length} tags selected</Typography>
                            <Button variant='text' onClick={clearTags}>Clear Tags</Button>
                        </>
                    ) 
                    :
                    null
            }
            {
                hasPrice &&
                <>
                    <Button variant='text' onClick={clearPrice}>Clear Price</Button>
                </>
            }
            <Button variant='text' onClick={clearAll}>Clear All</Button>
        </Stack>
    );
};

export default ClearBookFilterActions;