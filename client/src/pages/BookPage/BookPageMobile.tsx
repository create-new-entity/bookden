import {
    Chip, Container, Paper,
    Stack, Tooltip, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as R from 'ramda';

import {
    type UseAdminBookCoverHook, type UseAdminBookHook,
    type UsePublicBookCoverHook, type UsePublicBookHook
} from '../../hooks';
import {
    DEFAULT_BORDER_RADIUS, DEFAULT_GAP,
    LANGUAGE_LABEL_MAP,
    MARGIN_TOP_TO_AVOID_NAV_BAR, PLACE_HOLDER_BOOK_COVER
} from '../../constants';
import { BOOK_COVER_HEIGHT_MOBILE, BOOK_COVER_WIDTH_MOBILE } from './constants';
import { useAuthContext, useCartContext } from '../../contexts';
import { canBuyBook, canEditBook } from '../../utility';
import EditActionIcon from '../../components/app/ActionIcons/EditActionIcon';
import AddToCartAction from '../../components/app/ActionIcons/AddToCartAction';
import RemoveFromCartAction from '../../components/app/ActionIcons/RemoveFromCartAction';


type Styles = {
    rootStack: SxProps<Theme>;
    bookTitle: SxProps<Theme>;
    bookCoverContainer: SxProps<Theme>;
    bookDetailsContainer: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        rootStack: {
            marginTop: `calc(${MARGIN_TOP_TO_AVOID_NAV_BAR} / 2)`,
            marginBottom: '1rem'
        },
        bookTitle: {
            width: '100%',
            overflow: 'hidden',
            marginLeft: '1rem',
            marginRight: '1rem',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'center'
        },
        bookCoverContainer: {
            width: `${BOOK_COVER_WIDTH_MOBILE}rem`,
            height: `${BOOK_COVER_HEIGHT_MOBILE}rem`,
        },
        bookDetailsContainer: {
            padding: `${DEFAULT_GAP}px`,
            width: '100%',
            height: '26rem',
            overflowY: 'auto'
        },
    };
};


type BookPageMobileProps = {
    bookId: number;
    useBook: UsePublicBookHook | UseAdminBookHook;
    useBookCover: UsePublicBookCoverHook | UseAdminBookCoverHook;
};
const BookPageMobile = (props: BookPageMobileProps) => {
    const { bookId, useBook, useBookCover } = props;
    
    const { userType } = useAuthContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const bookQuery = useBook(bookId);
    const { bookCoverBlob } = useBookCover(bookId);
    const { isInCart, addToCart, removeFromCart } = useCartContext();

    const showEditBookButton = canEditBook(userType);
    const showAddToCartButton = canBuyBook(userType) && !isInCart(bookId);
    const showRemoveFromCartButton = canBuyBook(userType) && isInCart(bookId);
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

    return (
        <Container>
            <Stack
                direction={'column'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                gap={`${DEFAULT_GAP / 2}px`}
                sx={styles.rootStack}
            >
                <Paper
                    elevation={5}
                    sx={styles.bookCoverContainer}
                >
                    <img src={bookCoverBlob.objectUrl || PLACE_HOLDER_BOOK_COVER} alt='Book Cover' style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: DEFAULT_BORDER_RADIUS }} />
                </Paper>
                <Tooltip title={bookQuery.data?.title}>
                    <Typography variant='body1' sx={styles.bookTitle}>
                        {bookQuery.data?.title} by {bookQuery.data?.authors?.join(', ')}
                    </Typography>
                </Tooltip>
                <Stack
                    direction={'row'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Typography variant='h4' color='info'>
                        €{bookQuery.data?.price}
                    </Typography>
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
                        showEditBookButton && (
                            <EditActionIcon
                                onClick={handleEditBook}
                                tooltipTitle='Edit Book'
                            />
                        )
                    }
                    {
                        bookQuery.data?.deletedAt &&
                        <Chip label='Deleted' color='error' size='small' />
                    }
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
                                        <Chip label={tag} size='medium' onClick={() => navigate(`/books?tags=${encodedTag}`)} />
                                    );
                                })
                            }
                        </Stack>
                        <Typography variant='h5' fontWeight={'bold'}>
                            Synopsis:
                        </Typography>
                        <Typography variant='body1'>
                            {bookQuery.data?.synopsis}
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    );
};

export default BookPageMobile;