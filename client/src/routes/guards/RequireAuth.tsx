
import { Navigate, Outlet } from 'react-router-dom';

import { AUTH } from '../../constants';
import { useAuthContext, useNotificationContext } from '../../contexts';
import { useMe } from '../../hooks';
import { isTokenExpired } from '../../utility/utility';

const RequireAuth = () => {
    const { hasExistingLoggedInUser, token, clearAuthentication } = useAuthContext();
    const { handleShowNotification } = useNotificationContext();

    const { existingLoggedInData } = hasExistingLoggedInUser();
    const tokenFromLocalStorage = existingLoggedInData?.token;
    const resolvedToken = token || tokenFromLocalStorage;

    const meQuery = useMe(resolvedToken || '');

    if (!resolvedToken) {
        handleShowNotification('Session expired or user deleted. Please log in again.');
        return <Navigate to={AUTH} replace />;
    }

    if (isTokenExpired(resolvedToken)) {
        clearAuthentication();
        handleShowNotification('Session expired or user deleted. Please log in again.');
        return <Navigate to={AUTH} replace />;
    }

    if (meQuery.isPending) {
        return null; // or spinner
    }

    if (meQuery.isError) {
        clearAuthentication();
        handleShowNotification('Session expired or user deleted. Please log in again.');
        return <Navigate to={AUTH} replace />;
    }

    /*
        Note to future self:
        How <Outlet/> works: https://chatgpt.com/share/6967e2c6-6ca0-8012-a38c-57ab5ee59883 
    */
    return <Outlet />;
};

export default RequireAuth;
