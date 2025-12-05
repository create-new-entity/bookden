import { IconButton, Stack, Tooltip, useTheme, type SxProps, type Theme } from '@mui/material';
import { CREATE_ADMIN_USER, MARGIN_TOP_TO_AVOID_NAV_BAR, NAV_BAR_Z_INDEX, STACK_DEFAULT_GAP, SUPERADMIN } from '../../../constants';

import { CustomAutoComplete } from '../../custom';
import SelectUserType from '../SelectUserType';
import type { UserTypeOptions } from '../../../types';
import type { UserSearchParams } from '../../../validations';
import { useAuthContext } from '../../../contexts';
import SelectSortBy from '../SelectSortBy';
import SelectSortOrder from '../SelectSortOrder';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


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
    const { userType: clientUserType } = useAuthContext();
    const navigate = useNavigate();

    const { search, sortBy, sortOrder, userType, updateParams } = props;
    const styles = getStyles(theme);
    const isClientSuperAdmin = clientUserType === SUPERADMIN;

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
                    updateParams({ search: value });
                }}
                placeholder='Search by username or email'
            />
            <SelectSortBy sortBy={sortBy} updateParams={updateParams} />
            { isClientSuperAdmin && <SelectUserType userType={userType} updateParams={updateParams} /> }
            <SelectSortOrder sortOrder={sortOrder} updateParams={updateParams} />
            {
                isClientSuperAdmin && (
                    <Tooltip title='Add a new admin'>
                        <IconButton onClick={() => {
                            navigate(CREATE_ADMIN_USER);
                        }}>
                            <Add />
                        </IconButton>
                    </Tooltip>
                )
            }
        </Stack>
    );
};

export default UsersListFilterDesktop;