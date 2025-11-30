

import { Stack, useTheme, type Theme } from '@mui/material';

import { useUsersList, useViewOptions } from '../hooks';
import {
    CONTENT_MARGIN,
    MARGIN_TOP_TO_AVOID_NAV_BAR,
    NAV_BAR_Z_INDEX,
    STACK_DEFAULT_GAP
} from '../constants';
import {
    SelectSortBy,
    SelectSortOrder,
    SelectUserType,
    CustomAutoComplete,
    ViewOptions,
    UserCard,
    Items
} from '../components';


const getStyles = (theme: Theme) => {
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
        setSearch
    } = useUsersList();

    const { viewOption, setViewOption } = useViewOptions();

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
                <ViewOptions viewOption={viewOption} setViewOption={setViewOption} />
            </Stack>
            <Items
                items={usersList.data?.users || []}
                ItemComponent={UserCard}
                getKey={(user) => user.userId}
                viewOption={viewOption}
            />
        </Stack>
    );
};

export default UserManagementPage;