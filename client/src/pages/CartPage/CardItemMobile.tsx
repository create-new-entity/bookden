import {
    Box, Divider, Paper,
    Stack, Tooltip, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';

import type { CartItem } from '../../contexts';
import { useBookCover } from '../../hooks';
import { DEFAULT_GAP, PLACE_HOLDER_BOOK_COVER } from '../../constants';
import { BOOK_COVER_HEIGHT_MOBILE, BOOK_COVER_WIDTH_MOBILE } from '../BookPage/constants';
import CartItemControl from './CartItemControl';
import { roundTo2 } from '../../utility';


const BOOK_SIZE_RESCALE_FACTOR = 0.65;

type Styles = {
    bookCover: SxProps<Theme>;
    title: SxProps<Theme>;
    dataStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        bookCover: {
            width: `${BOOK_COVER_WIDTH_MOBILE * BOOK_SIZE_RESCALE_FACTOR}rem`,
            height: `${BOOK_COVER_HEIGHT_MOBILE * BOOK_SIZE_RESCALE_FACTOR}rem`,
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            }
        },
        dataStack: {
            width: '60%'
        },
        title: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center'
        }
    };
};




const CartItemMobile = (props: CartItem) => {
    const { book, quantity } = props;
    const theme = useTheme();
    const styles = getStyles(theme);
    const { bookCoverBlob } = useBookCover(book.bookId);
    const totalCost = roundTo2(book.price * quantity);

    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
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
                direction={'column'}
                justifyContent={'space-evenly'}
                alignItems={'center'}
                sx={styles.dataStack}
                alignSelf={'stretch'}
            >
                <Tooltip title={book.title}>
                    <Typography sx={styles.title} variant='body1'>
                        {book.title}
                    </Typography>
                </Tooltip>
                <Typography variant='body1'>
                    {quantity} x €{book.price}
                </Typography>
                <Typography variant='body1'>
                    Total: €{totalCost}
                </Typography>
                <Divider flexItem={true}/>
                <CartItemControl book={book} quantity={quantity} />
            </Stack>
        </Stack>
        
    );
};

export default CartItemMobile;