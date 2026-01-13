import { useLocation } from 'react-router-dom';
import { HOME } from '../constants/routes';

const allowedRoutes = [HOME];

export const useBookSearchVisibility = () => {
    const location = useLocation();
    return allowedRoutes.some(route => location.pathname === route);
};
