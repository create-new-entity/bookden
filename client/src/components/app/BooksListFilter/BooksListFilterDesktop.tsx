import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Button, Collapse, Divider, Stack,
    Tooltip, Typography, useTheme
} from '@mui/material';
import type { SelectChangeEvent, Theme, SxProps } from '@mui/material';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';


import type { BookSearchParams, BookSearchParamsWithTagsArray } from '../../../validations';
import type { PageMode, BooksPriceRangeMeta, BooksSortByOptions, SortOrder } from '../../../types';
import {
    ADMIN, BOOKS_LIST_SORT_BY_OPTIONS, CREATE_BOOK, MARGIN_TOP_TO_AVOID_NAV_BAR,
    MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY,
    NAV_BAR_Z_INDEX, STACK_DEFAULT_GAP, SUPERADMIN
} from '../../../constants';
import { SearchInput } from '../../custom';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';
import { useAuthContext } from '../../../contexts'; 
import BookTagsSelect from './BookTagsSelect';
import BooksPriceFilter from './BooksPriceFilter';
import { type UpdateMode } from '../../../hooks';
import type { ViewSelectorProps } from '../ViewSelector';
import ViewSelector from '../ViewSelector';
import ClearBookFilterActions from './ClearBookFilterActions';


type Styles = {
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    rootStack: SxProps<Theme>;
    bookTagsSelectCollapse: SxProps<Theme>;
    additionalOptionsStack: SxProps<Theme>;
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
        additionalOptionsStack: {
            width: '100%',
            backgroundColor: theme.palette.background.default
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
    mode: PageMode;
    tags: string[];
    updateParams: (params: Partial<BookSearchParams>, mode: UpdateMode) => void;
    priceRangeMeta: BooksPriceRangeMeta;
    params: BookSearchParamsWithTagsArray;
    selectedView: ViewSelectorProps['selectedView'];
    onViewChange: ViewSelectorProps['onViewChange'];
};

const BooksListFilterDesktop = (props: BooksListFilterDesktopProps) => {
    const { mode } = props;
    const theme = useTheme();
    const styles = getStyles(theme);
    const { userType } = useAuthContext();
    const [isTagsCollapseOpen, setIsTagsCollapseOpen] = useState(false);
    const navigate = useNavigate();

    const isClientAdminOrSuperAdmin = userType === SUPERADMIN || userType === ADMIN;
    const { tags, params, updateParams, priceRangeMeta, selectedView, onViewChange } = props;
    const { search, sortBy, sortOrder, priceMin, priceMax } = params;

    const resolvedBookListOptions = useMemo(() => {
        return BOOKS_LIST_SORT_BY_OPTIONS.filter((option) => {
            const { access } = option;
            if(!access) {
                // If access is not defined, it means the option is accessible to all user types.
                return true;
            }
            if(!userType) {
                return false;
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

    const handleTagsClick = () => {
        setIsTagsCollapseOpen(!isTagsCollapseOpen);
    };

    return (
        <>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'flex-start'}
                position={'sticky'}
                top={MARGIN_TOP_TO_AVOID_NAV_BAR}
                zIndex={NAV_BAR_Z_INDEX}
            >
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
                    <SearchInput id='bookManagementSearchBox'
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
                        options={resolvedBookListOptions}
                        onChange={handleSortByChange}
                        formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_BOOKS_SELECT_SORT_BY }}
                    />
                    <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
                    <ViewSelector
                        selectedView={selectedView}
                        onViewChange={onViewChange}
                    />
                    {
                        isClientAdminOrSuperAdmin && mode === 'admin' && (
                            <>
                                <Divider
                                    orientation='vertical'
                                    flexItem={true}
                                />
                                <Tooltip title='Add a new book'>
                                    <Button variant='contained' onClick={() => {
                                        navigate(CREATE_BOOK);
                                    }}>
                                        <Add/>
                                        <Typography variant='body1'>Add Book</Typography>
                                    </Button>
                                </Tooltip>
                            </>
                        )
                    }
                </Stack>
                <Stack sx={styles.additionalOptionsStack} direction={'column'} justifyContent={'flex-start'} alignItems={'flex-start'}>
                    <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} gap={STACK_DEFAULT_GAP}>
                        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} onClick={handleTagsClick}>
                            <Typography variant='subtitle1'>Additional Options</Typography>
                            {isTagsCollapseOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </Stack>
                        <ClearBookFilterActions
                            tags={tags}
                            priceMin={priceMin}
                            priceMax={priceMax}
                            params={params}
                            updateParams={updateParams}
                        />
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
                                label='Tags'
                                tags={tags}
                                onChange={(tags) => updateParams({ tags: tags.join(',') }, 'merge')}
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