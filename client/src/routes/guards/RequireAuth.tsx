
import { Navigate, Outlet } from 'react-router-dom';

import { AUTH } from '../../constants';
import { useAuthContext } from '../../contexts';

const RequireAuth = () => {
    const { hasExistingLoggedInUser, isLoggedIn } = useAuthContext();
    const { isUserLoggedIn: isLoggedInViaLocalStorage } = hasExistingLoggedInUser();

    const resolvedIsUserLoggedIn = isLoggedInViaLocalStorage || isLoggedIn;

    if (!resolvedIsUserLoggedIn) {
        return <Navigate to={AUTH} replace />;
    }

    /*
        Note to future self:
        How <Outlet/> works: https://chatgpt.com/share/6967e2c6-6ca0-8012-a38c-57ab5ee59883 
    */
    return <Outlet />;
};

export default RequireAuth;
