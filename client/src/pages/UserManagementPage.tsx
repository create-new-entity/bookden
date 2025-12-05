

import { IconButton, Stack, Tooltip, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Add } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import { useResponsive, useSetTabTitle, useUsersList } from '../hooks';
import {
    CONTENT_MARGIN,
    CREATE_ADMIN_USER,
    DEFAULT_GAP,
    GRID_VIEW,
    SUPERADMIN
} from '../constants';
import {
    UserCard,
    Items,
    CustomPagination,
    UsersListFilterDesktop,
    UsersListFilterMobile,
    CustomModal,
    type CustomModalRef
} from '../components';
import type { User } from '../types';
import { useAuthContext } from '../contexts';



type Styles = {
    rootStack: SxProps<Theme>;
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    items: SxProps<Theme>;
    topPagination: SxProps<Theme>;
    filterIconStack: SxProps<Theme>;
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
        },
        filterIconStack: {
            width: '100%',
            [theme.breakpoints.down('md')]: {
                display: 'flex'
            },
            [theme.breakpoints.up('md')]: {
                display: 'none'
            },
            padding: `${DEFAULT_GAP}px`
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
    const isClientSuperAdmin = clientUserType === SUPERADMIN;
    const navigate = useNavigate();
    const { isDesktop } = useResponsive();
    const modalRef = useRef<CustomModalRef | null>(null);
    const queryKey = ['usersList', params.search, params.page, params.sortBy, params.sortOrder, params.userType, token];
    

    const handleQueryClientInvalidation = () => {
        queryClient.invalidateQueries({ queryKey });
    };
    
    const openFilterModal = () => {
        console.log('Attempting to open filter modal');
        modalRef.current?.openModal();
    };
    
    useSetTabTitle('User Management');

    return (
        <>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
            >
                <Stack sx={styles.filterIconStack} direction={'row'} justifyContent={'flex-end'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
                    <IconButton onClick={openFilterModal}>
                        <FilterAltIcon />
                    </IconButton>
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
                {
                    isDesktop &&
                    <UsersListFilterDesktop
                        search={search}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        userType={userType}
                        updateParams={updateParams}
                    />
                }
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
            <CustomModal ref={modalRef}>
                <UsersListFilterMobile
                    search={search}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    userType={userType}
                    updateParams={updateParams}
                />
            </CustomModal>
        </>
    );
};

export default UserManagementPage;