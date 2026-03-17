

import {
    Button, Container, Divider,
    Stack, Typography, useTheme,
    type SxProps, type Theme
} from '@mui/material';
import { Link } from 'react-router-dom';

import useCartContext from '../../contexts/CartContext';
import { BOOKS, DEFAULT_GAP, MARGIN_TOP_TO_AVOID_NAV_BAR } from '../../constants';
import CartItemComponent from './CartItemComponent';
import useCheckout from '../../hooks/useCheckout';


type Styles = {
    container: SxProps<Theme>;
    cartItemsStack: SxProps<Theme>;
    totalCostStack: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        container: {
            marginTop: MARGIN_TOP_TO_AVOID_NAV_BAR
        },
        cartItemsStack: {
            marginBottom: '1rem'
        },
        totalCostStack: {
            marginTop: '1rem',
            marginBottom: '1rem'
        }
    };
};

const CartPage = () => {
    const { items, totalCost } = useCartContext();
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

    return (
        <Container sx={styles.container}>
            {
                items.length > 0 &&
                <>
                    <Stack
                        direction={'column'}
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        gap={`${DEFAULT_GAP * 2.5}px`}
                        sx={styles.cartItemsStack}
                    >
                        {
                            items.map((item) => (
                                <CartItemComponent key={item.book.bookId} book={item.book} quantity={item.quantity} />
                            ))
                        }
                    </Stack>
                    <Divider/>
                    <Stack
                        direction={'row'}
                        justifyContent={'end'}
                        alignItems={'center'}
                        gap={`${DEFAULT_GAP}px`}
                        sx={styles.totalCostStack}
                    >
                        <Button variant='contained' color='primary' onClick={handleCheckout}>
                            Checkout
                        </Button>
                        <Typography>
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
                        Your cart is empty
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

export default CartPage;