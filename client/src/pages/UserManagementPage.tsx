

import { Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { useSetTabTitle, useUsersList } from '../hooks';
import {
    CONTENT_MARGIN,
    GRID_VIEW,
    MARGIN_TOP_TO_AVOID_NAV_BAR,
    NAV_BAR_Z_INDEX,
    STACK_DEFAULT_GAP,
    SUPERADMIN
} from '../constants';
import {
    SelectSortBy,
    SelectSortOrder,
    SelectUserType,
    CustomAutoComplete,
    UserCard,
    Items,
    CustomPagination
} from '../components';
import type { User } from '../types';
import { useAuthContext } from '../contexts';


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
    const queryClient = useQueryClient();
    const { token } = useAuthContext();
    const { usersList, params, updateParams } = useUsersList();
    const { search, sortBy, sortOrder, userType } = params;
    const { userType: clientUserType } = useAuthContext();
    const queryKey = ['usersList', params.search, params.page, params.sortBy, params.sortOrder, params.userType, token];
    

    const handleQueryClientInvalidation = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const isClientSuperAdmin = clientUserType === SUPERADMIN;
    
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
                        updateParams({ search: value });
                    }}
                    placeholder='Search by username or email'
                />
                <SelectSortBy sortBy={sortBy} updateParams={updateParams} />
                { isClientSuperAdmin && <SelectUserType userType={userType} updateParams={updateParams} /> }
                <SelectSortOrder sortOrder={sortOrder} updateParams={updateParams} />
            </Stack>
            {
                usersList.data && usersList.data.data.length === 0 &&
                <Typography variant='body1'>
                    No users found matching your search criteria.
                </Typography>
            }
            {
                usersList.data &&
                <CustomPagination<User>
                    sx={styles.topPagination}
                    paginatedDataList={usersList.data}
                    updateParams={updateParams}
                />
            }
            <Items
                sx={styles.items}
                items={usersList.data?.data || []}
                ItemComponent={UserCard}
                getKey={(user) => user.userId}
                viewOption={GRID_VIEW}
                onItemDelete={handleQueryClientInvalidation}
            />
            {
                usersList.data &&
                <CustomPagination<User>
                    paginatedDataList={usersList.data}
                    updateParams={updateParams}
                />
            }
        </Stack>
    );
};

export default UserManagementPage;