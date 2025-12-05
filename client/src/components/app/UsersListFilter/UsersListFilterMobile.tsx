import { Paper, Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';

import type { UserSearchParams } from '../../../validations';
import type { UserTypeOptions } from '../../../types';
import { DEFAULT_GAP, SUPERADMIN } from '../../../constants';
import { CustomAutoComplete } from '../../custom';
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
                    <CustomAutoComplete id='userManagementSearchBox'
                        value={search}
                        handleChange={(value) => {
                            updateParams({ search: value });
                        }}
                        placeholder='username or email'
                    />
                    <SelectSortBy sortBy={sortBy} updateParams={updateParams} />
                    { isClientSuperAdmin && <SelectUserType userType={userType} updateParams={updateParams} /> }
                    <SelectSortOrder sortOrder={sortOrder} updateParams={updateParams} />
                </Stack>
            </Paper>
        </Stack>
    );
};

export default UsersListFilterMobile;