

import { Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

import { useSetTabTitle, useUsersList, useViewOptions } from '../hooks';
import {
    CONTENT_MARGIN,
    GRID_VIEW,
    MARGIN_TOP_TO_AVOID_NAV_BAR,
    NAV_BAR_Z_INDEX,
    STACK_DEFAULT_GAP
} from '../constants';
import {
    SelectSortBy,
    SelectSortOrder,
    SelectUserType,
    CustomAutoComplete,
    UserCard,
    Items
} from '../components';
import CustomPagination from '../components/custom/CustomPagination';
import type { User } from '../types';


type Styles = {
    rootStack: SxProps<Theme>;
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    items: SxProps<Theme>;
    topPagination: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            marginLeft: CONTENT_MARGIN,
            marginRight: CONTENT_MARGIN
        },
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
        items: {
            marginBottom: '1rem'
        },
        topPagination: {
            marginBottom: '1rem'
        }
    };
};



const UserManagementPage = () => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const {
        usersList,
        userType,
        setUserType,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        search,
        setSearch,
        setPage
    } = useUsersList();
    
    useSetTabTitle('User Management');

    return (
        <Stack
            sx={styles.rootStack}
            direction={'column'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >    
            <Stack
                sx={styles.searchBoxesStack}
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
                gap={STACK_DEFAULT_GAP}
                position={'sticky'}
                top={MARGIN_TOP_TO_AVOID_NAV_BAR}
                zIndex={NAV_BAR_Z_INDEX}
            >
                <CustomAutoComplete id='userManagementSearchBox'
                    sx={styles.searchBox}
                    value={search}
                    handleChange={(value) => {
                        setSearch(value);
                    }}
                    placeholder='Search by username or email'
                />
                <SelectSortBy sortBy={sortBy} setSortBy={setSortBy} />
                <SelectUserType userType={userType} setUserType={setUserType} />
                <SelectSortOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </Stack>
            {
                usersList.data && usersList.data.data.length === 0 &&
                <Typography variant='body1'>
                    No users found matching your search criteria.
                </Typography>
            }
            {
                usersList.data && usersList.data.data.length > 0 &&
                <CustomPagination<User>
                    sx={styles.topPagination}
                    paginatedDataList={usersList.data}
                    setPage={setPage}
                />
            }
            <Items
                sx={styles.items}
                items={usersList.data?.data || []}
                ItemComponent={UserCard}
                getKey={(user) => user.userId}
                viewOption={GRID_VIEW}
            />
            {
                usersList.data && usersList.data.data.length > 0 &&
                <CustomPagination<User>
                    paginatedDataList={usersList.data}
                    setPage={setPage}
                />
            }
        </Stack>
    );
};

export default UserManagementPage;