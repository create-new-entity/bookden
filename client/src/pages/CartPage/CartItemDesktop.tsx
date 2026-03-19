
import { Link } from 'react-router-dom';
import {
    Box, Paper, Stack,
    Typography, useTheme, type SxProps, type Theme
} from '@mui/material';

import {
    BOOK, BOOK_COVER_HEIGHT, BOOK_COVER_WIDTH,
    DEFAULT_BORDER_RADIUS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR,
    PLACE_HOLDER_BOOK_COVER
} from '../../constants';
import { usePublicBookCover } from '../../hooks';
import CartItemControl from './CartItemControl';
import type { CartItem } from '../../contexts';
import { roundTo2 } from '../../utility';

type Styles = {
    container: SxProps<Theme>;
    bookCover: SxProps<Theme>;
    titleAndTotalCostStack: SxProps<Theme>;
    paperContainingTitleAndControlStack: SxProps<Theme>;
    totalCostPaper: SxProps<Theme>;
    totalCostStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        container: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        bookCover: {
            width: `${BOOK_COVER_WIDTH * 0.5}px`,
            height: `${BOOK_COVER_HEIGHT * 0.5}px`,
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            },
            borderRadius: `${DEFAULT_BORDER_RADIUS}`
        },
        titleAndTotalCostStack: {
            flexGrow: 1
        },
        paperContainingTitleAndControlStack: {
            padding: '1rem',
            flexGrow: 1
        },
        totalCostPaper: {
            padding: '1rem',
            minWidth: '25%'
        },
        totalCostStack: {
            minWidth: '100%'
        }
    };
};


const CartItemDesktop = (props: CartItem) => {
    const { book, quantity } = props;
    const theme = useTheme();
    const styles = getStyles(theme);
    const { bookCoverBlob } = usePublicBookCover(book.bookId);

    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap={`${DEFAULT_GAP}px`}
            sx={{
                width: '100%'
            }}
        >
            <Paper>
                <Box sx={styles.bookCover}>
                    <img src={bookCoverBlob.objectUrl || PLACE_HOLDER_BOOK_COVER} alt='Book Cover' />
                </Box>
            </Paper>
            <Stack
                direction={'row'}
                justifyContent={'space-between'}
                alignItems={'center'}
                gap={`${DEFAULT_GAP}px`}
                sx={styles.titleAndTotalCostStack}
            >
                <Paper sx={styles.paperContainingTitleAndControlStack}>
                    <Stack
                        direction={'column'}
                        justifyContent={'space-between'}
                        alignItems={'flex-start'}
                        gap={`${DEFAULT_GAP}px`}
                    >
                        <Link
                            to={`${BOOK.replace(':bookId', book.bookId.toString())}`}
                            state={{ bookId: book.bookId }}
                        >
                            <Typography variant='body1'>
                                {book.title}
                            </Typography>
                        </Link>
                        <CartItemControl book={book} quantity={quantity} />
                    </Stack>
                </Paper>
                <Paper sx={styles.totalCostPaper}>
                    <Stack
                        direction={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        gap={`${DEFAULT_GAP * 0.1}px`}
                        sx={styles.totalCostStack}
                    >
                        <Typography variant='body1'>
                            {`${quantity} x €${book.price}`}
                        </Typography>
                        <Typography variant='body1'>
                            {`Total: €${roundTo2(book.price * quantity)}`}
                        </Typography>
                    </Stack>
                </Paper>
            </Stack>
        </Stack>
    );
};

export default CartItemDesktop;