import type { UseQueryResult } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography, useTheme, type SxProps, type Theme } from '@mui/material';
import { useRef, useState } from 'react';

import type {
    Book, BookAction, PageMode,
    BooksPriceRangeMeta, PaginatedDataList
} from '../../types';
import type {
    BookSearchParams, BookSearchParamsWithTagsArray
} from '../../validations/bookSearchParams';
import ClearBookFilterActions from './BooksListFilter/ClearBookFilterActions';
import FilterActionIcon from './ActionIcons/FilterActionIcon';
import { useAuthContext } from '../../contexts';
import {
    ADMIN, CREATE_BOOK, GRID_VIEW,
    SUPERADMIN, CONTENT_MARGIN, DEFAULT_GAP
} from '../../constants';
import AddActionIcon from './ActionIcons/AddActionIcon';
import {
    useResponsive, type UseAdminBookCoverHook, type UsePublicBookCoverHook,
    usePublicBookCover, useAdminBookCover
} from '../../hooks';
import { BooksListFilterDesktop, BooksListFilterMobile } from './BooksListFilter';
import type { ViewSelectorProps } from './ViewSelector';
import { CustomModal, CustomPagination, type CustomModalRef } from '../custom';
import Items from './Items';
import { BookCardDesktop, BookCardMobile } from './BookCard';

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


type BookListLayoutProps = {
    mode: PageMode;
    getActions: (book: Book) => BookAction[];
    booksList: UseQueryResult<PaginatedDataList<Book>, Error>;
    params: BookSearchParamsWithTagsArray;
    updateParams: (params: Partial<BookSearchParams>) => void;
    priceRangeMeta: BooksPriceRangeMeta | undefined;
};

const BookListLayout = (props: BookListLayoutProps) => {
    const { mode, booksList, params, updateParams, priceRangeMeta, getActions } = props;
    const { tags } = params;

    const theme = useTheme();
    const modalRef = useRef<CustomModalRef>(null);
    const { userType: clientUserType } = useAuthContext();
    const navigate = useNavigate();
    const { isDesktop, isMobile } = useResponsive();
    const [selectedView, setSelectedView] = useState<ViewSelectorProps['selectedView']>('grid');

    const useBookCover = mode === 'admin' ? useAdminBookCover : usePublicBookCover;

    const styles = getStyles(theme);
    const isClientAdminOrSuperAdmin = clientUserType === SUPERADMIN || clientUserType === ADMIN;
    
    const handleCreateBook = () => {
        navigate(CREATE_BOOK);
    };

    const onPageChange = (page: number) => {
        updateParams({ page });
    };

    const openFilterModal = () => {
        modalRef.current?.openModal();
    };

    const showFirstPagination = booksList.data && booksList.data.pagination.totalPages > 0;
    const showSecondPagination = booksList.data && booksList.data.pagination.totalPages > 1;

    return (
        <>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
            >
                <Stack
                    sx={styles.filterIconStack}
                    direction={'row'}
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                >
                    <ClearBookFilterActions
                        tags={tags}
                        priceMin={params.priceMin}
                        priceMax={params.priceMax}
                        params={params}
                        updateParams={updateParams}
                    />
                    <FilterActionIcon onClick={openFilterModal} tooltipTitle='Filter options' />
                    {
                        mode === 'admin' && isClientAdminOrSuperAdmin && (
                            <AddActionIcon
                                onClick={handleCreateBook}
                                tooltipTitle='Add a new book'
                            />
                        )
                    }
                </Stack>
                {
                    isDesktop && priceRangeMeta &&
                    <BooksListFilterDesktop
                        mode={mode}
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
                    showSecondPagination &&
                    <CustomPagination<Book>
                        sx={styles.topPagination}
                        paginatedDataList={booksList.data}
                        onPageChange={onPageChange}
                    />
                }
                <Items<Book, { getActions: (book: Book) => BookAction[], useBookCover: UsePublicBookCoverHook | UseAdminBookCoverHook }>
                    sx={styles.items}
                    items={booksList.data?.data || []}
                    itemProps={{ getActions, useBookCover }}
                    ItemComponent={(!isMobile && selectedView === GRID_VIEW) ? BookCardDesktop : BookCardMobile}
                    getKey={(book) => book.bookId}
                    viewOption={selectedView}
                />
                {
                    showFirstPagination &&
                    <CustomPagination<Book>
                        paginatedDataList={booksList.data}
                        onPageChange={onPageChange}
                    />
                }
            </Stack>
            {
                priceRangeMeta && (
                    <CustomModal ref={modalRef}>
                        <BooksListFilterMobile
                            params={params}
                            tags={tags}
                            updateParams={updateParams}
                            priceRangeMeta={priceRangeMeta}
                        />
                    </CustomModal>
                )
            }
        </>
    );
};

export default BookListLayout;