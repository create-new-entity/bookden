import { useLocation } from 'react-router-dom';

import { ADMIN, BOOK, CART, CUSTOMER, HOME, SUPERADMIN, WISHLIST } from '../constants';
import type { UserType } from '../types';

const allowedCases = [
    {
        route: [HOME, BOOK],
        allowed: [CUSTOMER, ADMIN, SUPERADMIN] as UserType[]
    },
    {
        route: [CART, WISHLIST],
        allowed: [CUSTOMER] as UserType[]
    }
];

export const useBookSearchVisibility = (userType: UserType) => {
    const location = useLocation();
    const isThisUserAllowedToSeeBookSearchNavInThisRoute = allowedCases.some(allowedCase => allowedCase.route.some(route => location.pathname === route || location.pathname.startsWith(route)) && allowedCase.allowed.includes(userType));
    return isThisUserAllowedToSeeBookSearchNavInThisRoute;
};
