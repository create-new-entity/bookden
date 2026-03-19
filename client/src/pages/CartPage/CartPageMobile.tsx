import {
    Button, Container, Divider,
    Stack, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import { Link } from 'react-router-dom';

import { useCartContext } from '../../contexts';
import CartItemMobile from './CartItemMobile';
import { BOOKS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR } from '../../constants';
import { useSetTabTitle, useCheckout } from '../../hooks';


type Styles = {
    container: SxProps<Theme>;
    divider: SxProps<Theme>;
    checkoutStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        container: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR,
        },
        divider: {
            marginTop: '1rem',
        },
        checkoutStack: {
            marginTop: '1rem',
        }
    };
};


const CartPageMobile = () => {
    const { items, totalCost, clearCart } = useCartContext();
    const theme = useTheme();
    const styles = getStyles(theme);
    const { orderMutation } = useCheckout();

    const handleCheckout = () => {
        const order = items.map((item) => ({
            bookId: item.book.bookId,
            quantity: item.quantity
        }));
        orderMutation.mutate({ items: order });
    };

    useSetTabTitle('Cart');

    return (
        <Container sx={styles.container}>
            {
                items.length > 0 &&
                <>
                    <Stack
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        gap={`${DEFAULT_GAP}px`}
                    >
                        {
                            items.map((item) => (
                                <CartItemMobile key={item.book.bookId} book={item.book} quantity={item.quantity} />
                            ))
                        }
                    </Stack>
                    <Divider flexItem={true} sx={styles.divider}/>
                    <Stack
                        direction={'row'}
                        justifyContent={'flex-end'}
                        alignItems={'center'}
                        gap={`${DEFAULT_GAP}px`}
                        sx={styles.checkoutStack}
                    >
                        <Button variant='contained' color='secondary' onClick={clearCart}>
                            Clear Cart
                        </Button>
                        <Button variant='contained' color='primary' onClick={handleCheckout}>
                            Checkout
                        </Button>
                        <Typography variant='body1'>
                            Total: €{totalCost}
                        </Typography>
                    </Stack>
                </>
            }
            {
                items.length === 0 &&
                <Stack
                    direction={'column'}
                    justifyContent={'flex-start'}
                    alignItems={'center'}
                    gap={`${DEFAULT_GAP}px`}
                >
                    <Typography variant='h4' color='text.secondary'>
                        Your cart is empty 🙂
                    </Typography>
                    <Link to={BOOKS}>
                        <Typography variant='body1' color='info'>
                            You can browse books here.
                        </Typography>
                    </Link>
                </Stack>
            }
        </Container>
    );
};

export default CartPageMobile;