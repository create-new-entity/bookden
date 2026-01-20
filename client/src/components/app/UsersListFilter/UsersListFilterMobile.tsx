import { Paper, Stack, Typography, useTheme, type SelectChangeEvent, type SxProps, type Theme } from '@mui/material';

import type { UserSearchParams } from '../../../validations';
import type { SortOrder, UsersSortByOptions, UserTypeOptions } from '../../../types';
import { DEFAULT_GAP, MINIMUM_WIDTH_FOR_USERS_SELECT_SORT_BY, SUPERADMIN, USERS_LIST_SORT_BY_OPTIONS } from '../../../constants';
import { SearchInput } from '../../custom';
import SelectSortBy from '../SelectSortBy';
import { useAuthContext } from '../../../contexts';
import { SelectSortOrder, SelectUserType } from '../..';


type Styles = {
    rootStack: SxProps<Theme>;
    containerStack: SxProps<Theme>;
    paper: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            height: '100vh',
            pointerEvents: 'none' // Needed, otherwise it consumes clicks meant for modal -> modal won't close after opening.
        },
        containerStack: {
            alignItems: 'stretch',
            padding: `${DEFAULT_GAP}px`
        },
        paper: {
            pointerEvents: 'auto', // Needed, otherwise modal gets closed when clicking on the paper.
            width: '90%'
        }
    };
};


type UsersListFilterMobileProps = {
    search: string;
    sortBy: UserSearchParams['sortBy'];
    sortOrder: UserSearchParams['sortOrder'];
    userType: UserTypeOptions;
    updateParams: (params: Partial<UserSearchParams>) => void;
};


const UsersListFilterMobile = (props: UsersListFilterMobileProps) => {
    const { search, sortBy, sortOrder, userType, updateParams } = props;

    const theme = useTheme();
    const { userType: clientUserType } = useAuthContext();

    const styles = getStyles(theme);
    const isClientSuperAdmin = clientUserType === SUPERADMIN;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value });
    };

    const handleSortByChange = (event: SelectChangeEvent<UsersSortByOptions>) => {
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
                    <SearchInput id='userManagementSearchBox'
                        value={search}
                        handleChange={(value) => {
                            updateParams({ search: value, page: 1 });
                        }}
                        placeholder='username or email'
                    />

                    {
                        /*
                            Instead of <SelectSortBy<UsersSortByOptions> .... />
                            This will also work: <SelectSortBy .../>
                            Due to the type inference from "value" prop.

                            But let's be explicit anyway.
                        */
                    }
                    <SelectSortBy<UsersSortByOptions>
                        id="users-list-sort-by"
                        formControlSx={{ minWidth: MINIMUM_WIDTH_FOR_USERS_SELECT_SORT_BY }}
                        value={sortBy}
                        options={USERS_LIST_SORT_BY_OPTIONS}
                        onChange={handleSortByChange}
                    />
                    { isClientSuperAdmin && <SelectUserType userType={userType} updateParams={updateParams} /> }
                    <SelectSortOrder sortOrder={sortOrder} onChange={handleSortOrderChange} />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default UsersListFilterMobile;