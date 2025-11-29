

import { Box, Stack, Typography, useTheme, type Theme } from '@mui/material';

import { useUsersList } from '../hooks';
import {
    CONTENT_MARGIN,
    MARGIN_TOP_TO_AVOID_NAV_BAR,
    STACK_DEFAULT_GAP,
    VERTICALLY_AVAILABLE_HEIGHT_WITHOUT_NAV_BAR
} from '../constants';
import { SelectSortBy, SelectSortOrder, SelectUserType, CustomAutoComplete } from '../components';


const getStyles = (_theme: Theme) => {
    return {
        rootStack: {
            height: VERTICALLY_AVAILABLE_HEIGHT_WITHOUT_NAV_BAR,
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR,
            marginLeft: CONTENT_MARGIN,
            marginRight: CONTENT_MARGIN
        },
        searchBoxesStack: {
            width: '100%',
            height: 'fit-content',
            flexWrap: 'wrap'
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
            >
                <CustomAutoComplete
                    id='userManagementSearchBox'
                    sx={styles.searchBox}
                    value={search}
                    handleChange={(value) => {
                        setSearch(value);
                    }}
                />
                <SelectSortBy sortBy={sortBy} setSortBy={setSortBy} />
                <SelectUserType userType={userType} setUserType={setUserType} />
                <SelectSortOrder sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </Stack>
            <Stack>
                {
                    usersList.data?.users.map((user) => {
                        return (
                            <Box key={user.userId}>
                                <Typography>{user.username}</Typography>
                                <Typography>{user.email}</Typography>
                                <Typography>{user.userType}</Typography>
                                <Typography>{user.createdAt}</Typography>
                            </Box>
                        );
                    })
                }
            </Stack>
        </Stack>
    );
};

export default UserManagementPage;