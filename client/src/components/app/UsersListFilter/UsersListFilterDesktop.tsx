import {
    Button,
    IconButton, Stack, Tooltip,
    Typography,
    useTheme, type SelectChangeEvent, type SxProps, type Theme
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import {
    CREATE_ADMIN_USER, MARGIN_TOP_TO_AVOID_NAV_BAR,
    MINIMUM_WIDTH_FOR_USERS_SELECT_SORT_BY,
    NAV_BAR_Z_INDEX, STACK_DEFAULT_GAP, SUPERADMIN,
    USERS_LIST_SORT_BY_OPTIONS
} from '../../../constants';
import { CustomAutoComplete } from '../../custom';
import SelectUserType from '../SelectUserType';
import type { UsersSortByOptions, SortOrder, UserTypeOptions } from '../../../types';
import type { UserSearchParams } from '../../../validations';
import { useAuthContext } from '../../../contexts';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';

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


type UsersListFilterDesktopProps = {
    search: string;
    sortBy: UserSearchParams['sortBy'];
    sortOrder: UserSearchParams['sortOrder'];
    userType: UserTypeOptions;
    updateParams: (params: Partial<UserSearchParams>) => void;
};

const UsersListFilterDesktop = (props: UsersListFilterDesktopProps) => {
    const theme = useTheme();
    const styles = getStyles(theme);
    const { userType: clientUserType } = useAuthContext();
    const navigate = useNavigate();

    const { search, sortBy, sortOrder, userType, updateParams } = props;
    const isClientSuperAdmin = clientUserType === SUPERADMIN;

    const handleSortOrderChange = (event: SelectChangeEvent<SortOrder>) => {
        updateParams({ sortOrder: event.target.value });
    };

    const handleSortByChange = (event: SelectChangeEvent<UsersSortByOptions>) => {
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
            <CustomAutoComplete id='userManagementSearchBox'
                sx={styles.searchBox}
                value={search}
                handleChange={(value) => {
                    updateParams({ search: value, page: 1 });
                }}
                placeholder='Search by username or email'
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
            {
                isClientSuperAdmin && (
                    <Tooltip title='Add a new admin'>
                        <Button variant='contained' onClick={() => {
                            navigate(CREATE_ADMIN_USER);
                        }}>
                            <Add />
                            <Typography variant='body1'>Add Admin</Typography>
                        </Button>
                    </Tooltip>
                )
            }
        </Stack>
    );
};

export default UsersListFilterDesktop;