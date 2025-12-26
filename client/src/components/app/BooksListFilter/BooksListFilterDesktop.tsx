import { IconButton, Stack, Tooltip, useTheme, type SxProps } from '@mui/material';
import type { SelectChangeEvent, Theme } from '@mui/material';
import { Add } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';

import type { BookSearchParams } from '../../../validations';
import type { BooksSortByOptions, SortOrder } from '../../../types';
import {
    ADMIN, BOOKS_LIST_SORT_BY_OPTIONS, MARGIN_TOP_TO_AVOID_NAV_BAR,
    NAV_BAR_Z_INDEX, STACK_DEFAULT_GAP, SUPERADMIN
} from '../../../constants';
import { CustomAutoComplete } from '../../custom';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';
import { useAuthContext } from '../../../contexts';

type Styles = {
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
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
        }
    };
};


type BooksListFilterDesktopProps = {
    search: string;
    sortBy: BookSearchParams['sortBy'];
    sortOrder: BookSearchParams['sortOrder'];
    tags: BookSearchParams['tags'];
    updateParams: (params: Partial<BookSearchParams>) => void;
};



const BooksListFilterDesktop = (props: BooksListFilterDesktopProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { userType } = useAuthContext();
    // const navigate = useNavigate();
    const isClientAdminOrSuperAdmin = userType === SUPERADMIN || userType === ADMIN;
    const { search, sortBy, sortOrder, updateParams } = props;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value });
    };

    const handleSortByChange = (event: SelectChangeEvent<BooksSortByOptions>) => {
        updateParams({ sortBy: event.target.value, page: 1 });
    };

    return (
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
                placeholder='Search by username or email'
            />
            <SelectSortBy<BooksSortByOptions>
                id="books-list-sort-by"
                value={sortBy}
                options={BOOKS_LIST_SORT_BY_OPTIONS}
                onChange={handleSortByChange}
            />
            <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
            {
                isClientAdminOrSuperAdmin && (
                    <Tooltip title='Add a new book'>
                        <IconButton onClick={() => {
                            // navigate(CREATE_BOOK);
                            console.log('add new book');
                        }}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                )
            }
        </Stack>
    );
};

export default BooksListFilterDesktop;