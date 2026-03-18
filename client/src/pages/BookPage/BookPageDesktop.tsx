import {
    Button, Chip, Container, Divider, Paper,
    Stack, Typography, useTheme, type SxProps, type Theme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as R from 'ramda';

import { useBook, useBookCover } from '../../hooks';
import {
    DEFAULT_BORDER_RADIUS, DEFAULT_GAP, LANGUAGE_LABEL_MAP,
    MARGIN_TOP_TO_AVOID_NAV_BAR, PLACE_HOLDER_BOOK_COVER
} from '../../constants';
import { BOOK_COVER_HEIGHT_DESKTOP, BOOK_COVER_WIDTH_DESKTOP } from './constants';
import { useAuthContext, useCartContext } from '../../contexts';
import { canBuyBook, canEditBook } from '../../utility';
import EditActionIcon from '../../components/app/ActionIcons/EditActionIcon';

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
};

const BookPageDesktop = (props: BookPageDesktopProps) => {
    const { bookId } = props;

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
                                    justifyContent={'flex-start'}
                                    alignItems={'center'}
                                    gap={`${DEFAULT_GAP}px`}
                                >
                                    <Typography variant='h4' color='info'>
                                        €{bookQuery.data?.price}
                                    </Typography>
                                    {
                                        showAddToCartButton && (
                                            <Button variant='contained' color='primary' onClick={handleAddToCart}>
                                                Add to cart
                                            </Button>
                                        )
                                    }
                                    {
                                        showRemoveFromCartButton && (
                                            <Button variant='contained' color='primary' onClick={handleRemoveFromCart}>
                                                Remove from cart
                                            </Button>
                                        )
                                    }
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
                                    <Typography>
                                        Tags: {bookQuery.data?.tags?.join(', ')}
                                    </Typography>
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