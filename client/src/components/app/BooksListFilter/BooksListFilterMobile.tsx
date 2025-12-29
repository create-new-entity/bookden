import {
    Paper, Stack, Typography,
    useTheme, type SelectChangeEvent, type SxProps, type Theme
} from '@mui/material';

import { BOOKS_LIST_SORT_BY_OPTIONS, DEFAULT_GAP, MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY } from '../../../constants';
import type { BookSearchParams } from '../../../validations';
import BookTagsSelect from './BookTagsSelect';
import { CustomAutoComplete } from '../../custom';
import type { BooksSortByOptions, SortOrder } from '../../../types';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';



type Styles = {
    rootStack: SxProps<Theme>;
    paper: SxProps<Theme>;
    containerStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            height: '100vh',
            pointerEvents: 'none' // Needed, otherwise it consumes clicks meant for modal -> modal won't close after opening.
        },
        paper: {
            pointerEvents: 'auto', // Needed, otherwise modal gets closed when clicking on the paper.
            width: '90%'
        },
        containerStack: {
            alignItems: 'stretch',
            padding: `${DEFAULT_GAP}px`
        }
    };
};


type BooksListFilterMobileProps = {
    search: string;
    sortBy: BookSearchParams['sortBy'];
    sortOrder: BookSearchParams['sortOrder'];
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>) => void;
};

const BooksListFilterMobile = (props: BooksListFilterMobileProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { search, sortBy, sortOrder, tags, updateParams } = props;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value });
    };

    const handleSortByChange = (event: SelectChangeEvent<BooksSortByOptions>) => {
        updateParams({ sortBy: event.target.value, page: 1 });
    };

    return (
        <Stack sx={styles.rootStack} direction={'column'} justifyContent={'center'} alignItems={'center'}>
            <Paper sx={styles.paper}>
                <Stack
                    sx={styles.containerStack}
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Stack direction={'row'} justifyContent={'center'} alignItems={'center'}>
                        <Typography variant='h6'>Filters</Typography>
                    </Stack>
                    <CustomAutoComplete id='booksListFilterSearchBox'
                        value={search}
                        handleChange={(value) => {
                            updateParams({ search: value, page: 1 });
                        }}
                        placeholder='Search by title or author'
                    />

                    {
                        /*
                            Instead of <SelectSortBy<BooksSortByOptions> .... />
                            This will also work: <SelectSortBy .../>
                            Due to the type inference from "value" prop.

                            But let's be explicit anyway.
                        */
                    }
                    <SelectSortBy<BooksSortByOptions>
                        id="books-list-sort-by"
                        formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY }}
                        value={sortBy}
                        options={BOOKS_LIST_SORT_BY_OPTIONS}
                        onChange={handleSortByChange}
                    />
                    <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
                    <BookTagsSelect
                        tags={tags}
                        updateParams={updateParams}
                    />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default BooksListFilterMobile;