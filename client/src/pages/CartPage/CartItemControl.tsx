import { Stack, useTheme, type SxProps, type Theme } from '@mui/material';

import RemoveActionIcon from '../../components/app/ActionIcons/RemoveActionIcon';
import AddActionIcon from '../../components/app/ActionIcons/AddActionIcon';
import useCartContext, { type BookInCart } from '../../contexts/CartContext';
import { CustomTextField } from '../../components';
import DeleteActionIcon from '../../components/app/ActionIcons/DeleteActionIcon';
import { useResponsive } from '../../hooks';


type Styles = {
    quantityTestField: SxProps<Theme>;
};

const getStyles = (_theme: Theme): Styles => {
    return {
        quantityTestField: {
            maxWidth: '20%'
        }
    };
};

type CartItemControlProps = {
    book: BookInCart;
    quantity: number;
};

const CartItemControl = (props: CartItemControlProps) => {
    const { book } = props;

    const theme = useTheme();
    const styles = getStyles(theme);
    const { addToCart, reduceFromCart, removeFromCart, updateQuantity } = useCartContext();
    const { isMobile } = useResponsive();

    return (
        <Stack
            direction={'row'}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <RemoveActionIcon
                onClick={() => reduceFromCart(book)}
                tooltipTitle='Remove from cart'
            />
            {
                !isMobile &&
                <CustomTextField
                    sx={styles.quantityTestField}
                    onChange={(event) => {
                        const numberQuantity = parseInt(event.target.value, 10);
                        const isValidQuantity = !(isNaN(numberQuantity) || numberQuantity < 1);
                        if(isValidQuantity) {
                            updateQuantity(book, numberQuantity);
                        }
                    }}
                />
            }
            <AddActionIcon
                onClick={() => addToCart(book)}
                tooltipTitle='Add to cart'
            />
            <DeleteActionIcon
                onClick={() => removeFromCart(book)}
                tooltipTitle='Remove from cart'
            />
        </Stack>
    );
};

export default CartItemControl;