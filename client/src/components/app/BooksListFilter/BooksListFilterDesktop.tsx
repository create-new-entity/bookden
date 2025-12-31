import {
    Button,
    Collapse, IconButton, Stack,
    Tooltip, Typography, useTheme
} from '@mui/material';
import type { SelectChangeEvent, Theme, SxProps } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { useNavigate } from 'react-router-dom';

import type { BookSearchParams } from '../../../validations';
import type { BooksSortByOptions, SortOrder } from '../../../types';
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

type Styles = {
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    bookTagsSelectStack: SxProps<Theme>;
    bookTagsMultiAutoComplete: SxProps<Theme>;
    bookTagsSelectCollapse: SxProps<Theme>;
    tagsStack: SxProps<Theme>;
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
        bookTagsSelectStack: {
            height: '100vh',
            pointerEvents: 'none' // Needed, otherwise it consumes clicks meant for modal -> modal won't close after opening.
        },
        bookTagsSelectCollapse: {
            width: '100%'
        },
        bookTagsMultiAutoComplete: {
            pointerEvents: 'auto', // Needed, otherwise it consumes clicks meant for modal -> modal won't close after opening.
        }
    };
};


type BooksListFilterDesktopProps = {
    search: string;
    sortBy: BookSearchParams['sortBy'];
    sortOrder: BookSearchParams['sortOrder'];
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>) => void;
};



const BooksListFilterDesktop = (props: BooksListFilterDesktopProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { userType } = useAuthContext();
    const [isTagsCollapseOpen, setIsTagsCollapseOpen] = useState(false);
    // const navigate = useNavigate();
    
    const isClientAdminOrSuperAdmin = userType === SUPERADMIN || userType === ADMIN;
    const { search, sortBy, sortOrder, updateParams, tags } = props;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value });
    };

    const handleSortByChange = (event: SelectChangeEvent<BooksSortByOptions>) => {
        updateParams({ sortBy: event.target.value, page: 1 });
    };

    const handleTagsClick = () => {
        setIsTagsCollapseOpen(!isTagsCollapseOpen);
    };

    const clearTags = () => {
        updateParams({ tags: '' });
    };

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
                            updateParams({ search: value, page: 1 });
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
                        <Typography variant='subtitle1'>Additional Options</Typography>
                        <IconButton onClick={handleTagsClick}>
                            {isTagsCollapseOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
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
                    </Stack>
                    <Collapse in={isTagsCollapseOpen} sx={styles.bookTagsSelectCollapse}>
                        <BookTagsSelect
                            tags={tags}
                            updateParams={updateParams}
                            multiAutoCompleteStyles={styles.bookTagsMultiAutoComplete}
                        />
                    </Collapse>
                </Stack>
            </Stack>
        </>
    );
};

export default BooksListFilterDesktop;