import { Stack, useTheme, type SxProps, type Theme } from '@mui/material';


import { useBooksList, useResponsive } from '../hooks';
import { CONTENT_MARGIN, DEFAULT_GAP } from '../constants';
import { BooksListFilterDesktop } from '../components/app/BooksListFilter';



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



const BookManagementPage = () => {
    const { isDesktop } = useResponsive();
    const theme = useTheme();
    const styles = getStyles(theme);
    const { params, updateParams } = useBooksList();
    const { search, sortBy, sortOrder, tags } = params;
    

    return (
        <>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
            >
                {/* <Stack sx={styles.filterIconStack} direction={'row'} justifyContent={'flex-end'} alignItems={'center'} gap={`${DEFAULT_GAP}px`}>
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
                </Stack> */}
                {
                    isDesktop &&
                    <BooksListFilterDesktop
                        search={search}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        tags={tags}
                        updateParams={updateParams}
                    />
                }
                {/* {
                    usersList.data && usersList.data.data.length === 0 &&
                    <Typography variant='body1'>
                        No users found matching your search criteria.
                    </Typography>
                } */}
                {/* {
                    usersList.data &&
                    <CustomPagination<User>
                        sx={styles.topPagination}
                        paginatedDataList={usersList.data}
                        updateParams={updateParams}
                    />
                } */}
                {/* <Items
                    sx={styles.items}
                    items={usersList.data?.data || []}
                    ItemComponent={UserCard}
                    getKey={(user) => user.userId}
                    viewOption={GRID_VIEW}
                    onItemDelete={handleQueryClientInvalidation}
                /> */}
                {/* {
                    usersList.data &&
                    <CustomPagination<User>
                        paginatedDataList={usersList.data}
                        updateParams={updateParams}
                    />
                } */}
            </Stack>
        </>
    );
};

export default BookManagementPage;