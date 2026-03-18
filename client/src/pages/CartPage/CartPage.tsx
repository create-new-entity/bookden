
import { useResponsive } from '../../hooks';
import CartPageMobile from './CartPageMobile';
import CartPageDesktop from './CartPageDesktop';


const CartPage = () => {
    const { isMobile } = useResponsive();

    return (
        <>
            {
                isMobile ? <CartPageMobile /> : <CartPageDesktop />
            }
        </>
    );
};

export default CartPage;