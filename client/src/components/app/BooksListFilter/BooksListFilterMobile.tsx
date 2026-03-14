import {
    Paper, Stack, Typography,
    useTheme, type SelectChangeEvent, type SxProps, type Theme
} from '@mui/material';

import {
    BOOKS_LIST_SORT_BY_OPTIONS, DEFAULT_GAP, MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY
} from '../../../constants';
import BookTagsSelect from './BookTagsSelect';
import { SearchInput } from '../../custom';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';
import type { BookSearchParams } from '../../../validations';
import type { BooksPriceRangeMeta, BooksSortByOptions, SortOrder } from '../../../types';
import type { UpdateMode } from '../../../hooks';
import BooksPriceFilter from './BooksPriceFilter';
import { useAuthContext } from '../../../contexts';
import { useMemo } from 'react';



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
    priceRangeMeta: BooksPriceRangeMeta;
    params: Omit<BookSearchParams, 'tags'>;
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>, mode: UpdateMode) => void;
};

const BooksListFilterMobile = (props: BooksListFilterMobileProps) => {
    const theme = useTheme();
    const { userType } = useAuthContext();
    const styles = getStyles(theme);
    const { tags, params, updateParams, priceRangeMeta } = props;
    const { search, sortBy, sortOrder, priceMin, priceMax } = params;

    const resolvedBookListOptions = useMemo(() => {
        if(!userType) {
            return [];
        }
        return BOOKS_LIST_SORT_BY_OPTIONS.filter((option) => {
            const { access } = option;
            if(!access) {
                // If access is not defined, it means the option is accessible to all user types.
                return true;
            }
            return access.includes(userType);
        });
    }, [userType]);

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value }, 'merge');
    };

    const handleSortByChange = (event: SelectChangeEvent<BooksSortByOptions>) => {
        updateParams({ sortBy: event.target.value, page: 1 }, 'merge');
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
                    <SearchInput id='booksListFilterSearchBox'
                        value={search}
                        handleChange={(value) => {
                            updateParams({ search: value, page: 1 }, 'merge');
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
                        options={resolvedBookListOptions}
                        onChange={handleSortByChange}
                    />
                    <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
                    <BookTagsSelect
                        label='Tags'
                        tags={tags}
                        onChange={(tags) => updateParams({ tags: tags.join(',') }, 'merge')}
                    />
                    <Typography variant='subtitle1'>
                        {
                            tags.length > 0 && `${tags.length} tags selected`
                        }
                    </Typography>
                    <BooksPriceFilter   
                        priceMin={priceMin}
                        priceMax={priceMax}
                        priceRangeMeta={priceRangeMeta}
                        updateParams={(params) => updateParams(params, 'merge')}
                    />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default BooksListFilterMobile;