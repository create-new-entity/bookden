import { useRef, useState } from 'react';
import {
    IconButton, Stack, Tooltip,
    Typography, useTheme, type SxProps, type Theme
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Add } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';


import { useBooksList, useResponsive, useSetTabTitle } from '../hooks';
import {
    ADMIN, CONTENT_MARGIN, CREATE_BOOK,
    DEFAULT_GAP, GRID_VIEW, SUPERADMIN
} from '../constants';
import {
    CustomModal, CustomPagination, Items,
    BooksListFilterDesktop, type CustomModalRef,
    BooksListFilterMobile, BookCardDesktop,
    BookCardMobile
} from '../components';
import { useAuthContext } from '../contexts';
import type { Book } from '../types';
import type { ViewSelectorProps } from '../components/app/ViewSelector';



type Styles = {
    searchBoxesStack: SxProps<Theme>;
    searchBox: SxProps<Theme>;
    items: SxProps<Theme>;
    topPagination: SxProps<Theme>;
    filterIconStack: SxProps<Theme>;
    rootStack: SxProps<Theme>;
};

const getStyles = (theme: Theme): Styles => {
    return {
        rootStack: {
            paddingLeft: CONTENT_MARGIN,
            paddingRight: CONTENT_MARGIN
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
    const { isDesktop, isMobile } = useResponsive();
    const theme = useTheme();
    const { booksList, params, updateParams, priceRangeMeta } = useBooksList();
    const modalRef = useRef<CustomModalRef>(null);
    const { userType: clientUserType } = useAuthContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState<ViewSelectorProps['selectedView']>(isMobile ? 'list' : 'grid');
    
    const styles = getStyles(theme);
    const { search, sortBy, sortOrder, tags } = params;
    const isClientAdminOrSuperAdmin = clientUserType === SUPERADMIN || clientUserType === ADMIN;
    const queryKey = ['booksList', params.search, params.page, params.sortBy, params.sortOrder, params.tags];
    

    const handleQueryClientInvalidation = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const openFilterModal = () => {
        modalRef.current?.openModal();
    };

    const onPageChange = (page: number) => {
        updateParams({ page });
    };
    
    useSetTabTitle('Book Management');
    

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
                        isClientAdminOrSuperAdmin && (
                            <Tooltip title='Add a new book'>
                                <IconButton onClick={() => {
                                    navigate(CREATE_BOOK);
                                }}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                </Stack>
                {
                    isDesktop && priceRangeMeta &&
                    <BooksListFilterDesktop
                        tags={tags}
                        params={params}
                        updateParams={updateParams}
                        priceRangeMeta={priceRangeMeta}
                        selectedView={selectedView}
                        onViewChange={setSelectedView}
                    />
                }
                {
                    booksList.data && booksList.data.data.length === 0 &&
                    <Typography variant='body1'>
                        No books found matching your search criteria.
                    </Typography>
                }
                {
                    booksList.data &&
                    <CustomPagination<Book>
                        sx={styles.topPagination}
                        paginatedDataList={booksList.data}
                        onPageChange={onPageChange}
                    />
                }
                <Items<Book>
                    sx={styles.items}
                    items={booksList.data?.data || []}
                    ItemComponent={(!isMobile && selectedView === GRID_VIEW) ? BookCardDesktop : BookCardMobile}
                    getKey={(book) => book.bookId}
                    viewOption={selectedView}
                    onItemDelete={handleQueryClientInvalidation}
                />
                {
                    booksList.data &&
                    <CustomPagination<Book>
                        paginatedDataList={booksList.data}
                        onPageChange={onPageChange}
                    />
                }
            </Stack>
            <CustomModal ref={modalRef}>
                <BooksListFilterMobile
                    search={search}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    tags={tags}
                    updateParams={updateParams}
                />
            </CustomModal>
        </>
    );
};

export default BookManagementPage;