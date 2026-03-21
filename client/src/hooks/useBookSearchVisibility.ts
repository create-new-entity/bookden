import { useLocation } from 'react-router-dom';

import { CART, HOME, WISHLIST } from '../constants';

export const useBookSearchVisibility = () => {
    const location = useLocation();

    const isHome = location.pathname === HOME;
    const isCart = location.pathname === CART;
    const isWishlist = location.pathname === WISHLIST;

    const isBookDetail = /^\/books\/\d+$/.test(location.pathname);

    return isHome || isCart || isWishlist || isBookDetail;
};
