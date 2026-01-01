import {
    Button, Collapse, IconButton, Stack,
    Tooltip, Typography, useTheme
} from '@mui/material';
import type { SelectChangeEvent, Theme, SxProps } from '@mui/material';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useState } from 'react';

import type { BookSearchParams } from '../../../validations';
import type { BooksPriceRangeMeta, BooksSortByOptions, SortOrder } from '../../../types';
import {
    ADMIN, BOOKS_LIST_SORT_BY_OPTIONS, MARGIN_TOP_TO_AVOID_NAV_BAR,
    MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY,
    NAV_BAR_Z_INDEX, STACK_DEFAULT_GAP, SUPERADMIN
} from '../../../constants';
import { CustomAutoComplete } from '../../custom';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';
import { useAuthContext } from '../../../contexts';
import BookTagsSelect from './BookTagsSelect';
import BooksPriceFilter from './BooksPriceFilter';
import type { UpdateMode } from '../../../hooks/useDeepLinkedSearchParams';

type Styles = {
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    bookTagsSelectCollapse: SxProps<Theme>;
    tagsStack: SxProps<Theme>;
    collapseStack: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        searchBoxesStack: {
            width: '100%',
            height: 'fit-content',
            flexWrap: 'wrap',
            backgroundColor: theme.palette.background.default,
            paddingTop: '1rem',
            paddingBottom: '1rem'
        },
        searchBox: {
            flexGrow: 1
        },
        rootStack: {
            width: '100%'
        },
        tagsStack: {
            width: '100%'
        },
        bookTagsSelectCollapse: {
            width: '100%',
            marginBottom: '1rem'
        },
        collapseStack: {
            alignItems: 'stretch'
        }
    };
};


type BooksListFilterDesktopProps = {
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>, mode: UpdateMode) => void;
    priceRangeMeta: BooksPriceRangeMeta;
    params: Omit<BookSearchParams, 'tags'>;
};

const BooksListFilterDesktop = (props: BooksListFilterDesktopProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { userType } = useAuthContext();
    const [isTagsCollapseOpen, setIsTagsCollapseOpen] = useState(false);
    
    const isClientAdminOrSuperAdmin = userType === SUPERADMIN || userType === ADMIN;
    const { tags, params, updateParams, priceRangeMeta } = props;
    const { search, sortBy, sortOrder, priceMin, priceMax } = params;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value }, 'merge');
    };

    const handleSortByChange = (event: SelectChangeEvent<BooksSortByOptions>) => {
        updateParams({ sortBy: event.target.value, page: 1 }, 'merge');
    };

    const handleTagsClick = () => {
        setIsTagsCollapseOpen(!isTagsCollapseOpen);
    };

    const clearTags = () => {
        updateParams({ tags: '' }, 'merge');
    };

    const clearPrice = () => {
        const newParams = { ...params };
        delete newParams.priceMin;
        delete newParams.priceMax;
        updateParams(newParams, 'replace');
    };

    const hasPrice = priceMin !== undefined && priceMax !== undefined;


    return (
        <>
            <Stack sx={styles.rootStack} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                <Stack
                    sx={styles.searchBoxesStack}
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    gap={STACK_DEFAULT_GAP}
                    position={'sticky'}
                    top={MARGIN_TOP_TO_AVOID_NAV_BAR}
                    zIndex={NAV_BAR_Z_INDEX}
                >
                    <CustomAutoComplete id='bookManagementSearchBox'
                        sx={styles.searchBox}
                        value={search}
                        handleChange={(value) => {
                            updateParams({ search: value, page: 1 }, 'merge');
                        }}
                        placeholder='Search by title or author'
                    />
                    <SelectSortBy<BooksSortByOptions>
                        id="books-list-sort-by"
                        value={sortBy}
                        options={BOOKS_LIST_SORT_BY_OPTIONS}
                        onChange={handleSortByChange}
                        formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY }}
                    />
                    <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
                    {
                        isClientAdminOrSuperAdmin && (
                            <Tooltip title='Add a new book'>
                                <IconButton onClick={() => {
                                    // navigate(CREATE_BOOK);
                                    console.log('add new book');
                                }}>
                                    <Add/>
                                </IconButton>
                            </Tooltip>
                        )
                    }
                </Stack>
                <Stack sx={styles.tagsStack} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'} gap={STACK_DEFAULT_GAP}>
                    <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={STACK_DEFAULT_GAP}>
                        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} onClick={handleTagsClick}>
                            <Typography variant='subtitle1'>Additional Options</Typography>
                            {isTagsCollapseOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </Stack>
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
                    </Stack>
                    <Collapse in={isTagsCollapseOpen} sx={styles.bookTagsSelectCollapse}>
                        <Stack
                            sx={styles.collapseStack}
                            direction={'column'}
                            justifyContent={'flex-start'}
                            alignItems={'center'}
                            gap={STACK_DEFAULT_GAP}
                        >
                            <BookTagsSelect
                                tags={tags}
                                updateParams={(params) => updateParams(params, 'merge')}
                            />
                            <BooksPriceFilter   
                                priceMin={priceMin}
                                priceMax={priceMax}
                                priceRangeMeta={priceRangeMeta}
                                updateParams={(params) => updateParams(params, 'merge')}
                            />
                        </Stack>
                    </Collapse>
                </Stack>
            </Stack>
        </>
    );
};

export default BooksListFilterDesktop;