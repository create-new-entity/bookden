import {
    Chip, Container, Divider, Paper,
    Stack, Typography, useTheme, type SxProps, type Theme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as R from 'ramda';
import { useMemo } from 'react';

import {
    useBooksWishList,
    useBooksWishListMutation,
    type UseAdminBookCoverHook, type UseAdminBookHook,
    type UsePublicBookCoverHook, type UsePublicBookHook
} from '../../hooks';
import {
    DEFAULT_BORDER_RADIUS, DEFAULT_GAP, LANGUAGE_LABEL_MAP,
    MARGIN_TOP_TO_AVOID_NAV_BAR, PLACE_HOLDER_BOOK_COVER
} from '../../constants';
import { BOOK_COVER_HEIGHT_DESKTOP, BOOK_COVER_WIDTH_DESKTOP } from './constants';
import { useAuthContext, useCartContext } from '../../contexts';
import { canBuyOrWishlistBook, canEditBook } from '../../utility';
import EditActionIcon from '../../components/app/ActionIcons/EditActionIcon';
import AddToCartAction from '../../components/app/ActionIcons/AddToCartAction';
import RemoveFromCartAction from '../../components/app/ActionIcons/RemoveFromCartAction';
import AddToWishlistActionIcon from '../../components/app/ActionIcons/AddToWishlistAction';
import RemoveFromWishlistActionIcon from '../../components/app/ActionIcons/RemoveFromWishlistAction';


type Styles = {
    rootStack: SxProps<Theme>;
    bookCoverContainer: SxProps<Theme>;
    bookDetailsContainer: SxProps<Theme>;
    synopsisContainer: SxProps<Theme>;
    synopsisDivider: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR,
            paddingBottom: '1rem'
        },
        bookCoverContainer: {
            width: `${BOOK_COVER_WIDTH_DESKTOP}rem`,
            minWidth: `${BOOK_COVER_WIDTH_DESKTOP}rem`,
            height: `${BOOK_COVER_HEIGHT_DESKTOP}rem`
        },
        bookDetailsContainer: {
            padding: `${DEFAULT_GAP}px`,
            width: '100%',
            height: '26rem',
            overflowY: 'auto'

        },
        synopsisContainer: {
            padding: `${DEFAULT_GAP}px`
        },
        synopsisDivider: {
            margin: `${DEFAULT_GAP}px 0`
        }
    };
};

type BookPageDesktopProps = {
    bookId: number;
    useBook: UsePublicBookHook | UseAdminBookHook;
    useBookCover: UsePublicBookCoverHook | UseAdminBookCoverHook;
};

const BookPageDesktop = (props: BookPageDesktopProps) => {
    const { bookId, useBook, useBookCover } = props;

    const { userType } = useAuthContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const bookQuery = useBook(bookId);
    const { bookCoverBlob } = useBookCover(bookId);
    const { isInCart, addToCart, removeFromCart } = useCartContext();
    const { isWishlisted } = useBooksWishList();
    const { addToWishList, removeFromWishList } = useBooksWishListMutation();

    const showEditBookButton = useMemo(() => canEditBook(userType), [userType]);
    const canBuyOrWishlist = useMemo(() => canBuyOrWishlistBook(userType), [userType]);
    const showAddToCartButton = useMemo(() => canBuyOrWishlist && !isInCart(bookId), [canBuyOrWishlist, isInCart, bookId]);
    const showRemoveFromCartButton = useMemo(() => canBuyOrWishlist && isInCart(bookId), [canBuyOrWishlist, isInCart, bookId]);
    const showAddToWishListButton = useMemo(() => canBuyOrWishlist && !isWishlisted(bookId), [canBuyOrWishlist, isWishlisted, bookId]);
    const showRemoveFromWishListButton = useMemo(() => canBuyOrWishlist && isWishlisted(bookId), [canBuyOrWishlist, isWishlisted, bookId]);

    const styles = getStyles(theme);

    const handleEditBook = () => {
        navigate(`/books/${bookId}/update`);
    };

    const handleAddToCart = () => {
        if(!bookQuery.data) return;
        addToCart(R.pick(['bookId', 'title', 'price'], bookQuery.data));
    };

    const handleRemoveFromCart = () => {
        if(!bookQuery.data) return;
        removeFromCart(R.pick(['bookId', 'title', 'price'], bookQuery.data));
    };

    const handleAddToWishList = () => {
        if(!bookQuery.data) return;
        addToWishList.mutate(bookId);
    };

    const handleRemoveFromWishList = () => {
        if(!bookQuery.data) return;
        removeFromWishList.mutate(bookId);
    };
    return (
        <Container>
            <Stack
                sx={styles.rootStack}
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'stretch'}
                gap={`${DEFAULT_GAP}px`}
            >
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-start'}
                        alignItems={'flex-start'}
                        gap={`${DEFAULT_GAP}px`}
                        flexGrow={1}
                    >
                        <Paper
                            elevation={5}
                            sx={styles.bookCoverContainer}
                        >
                            <img src={bookCoverBlob.objectUrl || PLACE_HOLDER_BOOK_COVER} alt='Book Cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: DEFAULT_BORDER_RADIUS }} />
                        </Paper>
                        <Stack
                            direction={'column'}
                            justifyContent={'center'}
                            alignItems={'flex-end'}
                            gap={`${DEFAULT_GAP}px`}
                            flexGrow={1}
                            alignSelf={'stretch'}
                        >
                            <Stack
                                direction={'row'}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                                alignSelf={'stretch'}
                            >
                                <Stack
                                    direction={'row'}
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={`${DEFAULT_GAP / 4}px`}
                                >
                                    {
                                        showEditBookButton && (
                                            <EditActionIcon
                                                onClick={handleEditBook}
                                                tooltipTitle='Edit Book'
                                                testId='edit-book-icon'
                                            />
                                        )
                                    }
                                    {
                                        bookQuery.data?.deletedAt &&
                                        <Chip label='Deleted' color='error' size='small' />
                                    }
                                </Stack>
                                <Stack
                                    direction={'row'}
                                    justifyContent={'space-between'}
                                    alignItems={'center'}
                                    gap={`${DEFAULT_GAP}px`}
                                >
                                    <Typography variant='h4' color='info'>
                                        €{bookQuery.data?.price}
                                    </Typography>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'flex-start'}
                                        alignItems={'center'}
                                    >
                                        {
                                            showAddToCartButton && (
                                                <AddToCartAction
                                                    onClick={handleAddToCart}
                                                    tooltipTitle='Add to cart'
                                                />
                                            )
                                        }
                                        {
                                            showRemoveFromCartButton && (
                                                <RemoveFromCartAction
                                                    onClick={handleRemoveFromCart}
                                                    tooltipTitle='Remove from cart'
                                                />
                                            )
                                        }
                                        {
                                            showAddToWishListButton && (
                                                <AddToWishlistActionIcon
                                                    onClick={handleAddToWishList}
                                                    tooltipTitle='Add to wishlist'
                                                />
                                            )
                                        }
                                        {
                                            showRemoveFromWishListButton && (
                                                <RemoveFromWishlistActionIcon
                                                    onClick={handleRemoveFromWishList}
                                                    tooltipTitle='Remove from wishlist'
                                                />
                                            )
                                        }
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Paper
                                elevation={5}
                                sx={styles.bookDetailsContainer}
                            >
                                <Stack
                                    direction={'column'}
                                    justifyContent={'flex-start'}
                                    alignItems={'flex-start'}
                                    gap={`${DEFAULT_GAP}px`}
                                >
                                    <Typography variant='h4' fontWeight={'bold'}>
                                        {bookQuery.data?.title}
                                    </Typography>
                                    <Typography variant='body1'>
                                        By {bookQuery.data?.authors?.join(', ')}
                                    </Typography>
                                    <Typography>
                                        ISBN: {bookQuery.data?.isbn}
                                    </Typography>
                                    <Typography>
                                        Published in: {bookQuery.data?.yearPublished}
                                    </Typography>
                                    <Typography>
                                        Pages: {bookQuery.data?.pages}
                                    </Typography>
                                    {
                                        bookQuery.data?.language && (
                                            <Typography>
                                                Language: {LANGUAGE_LABEL_MAP[bookQuery.data?.language]}
                                            </Typography>
                                        )
                                    }
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'flex-start'}
                                        alignItems={'center'}
                                        sx={{ flexWrap: 'wrap', gap: `${DEFAULT_GAP / 2}px`}}
                                    >
                                        Tags:
                                        {
                                            bookQuery.data?.tags?.map((tag) => {
                                                const encodedTag = encodeURIComponent(tag);
                                                return (
                                                    <Chip key={tag} label={tag} size='medium' onClick={() => navigate(`/books?tags=${encodedTag}`)} />
                                                );
                                            })
                                        }
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Stack>
                <Paper elevation={5} sx={styles.synopsisContainer}>
                    <Stack>
                        <Typography variant='h5' fontWeight={'bold'}>
                            Synopsis:
                        </Typography>
                        <Divider sx={styles.synopsisDivider}/>
                        <Typography variant='body1'>
                            {bookQuery.data?.synopsis}
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

export default BookPageDesktop;