import { Navigate, Outlet } from 'react-router-dom';

import { AUTH, UNAUTHORIZED } from '../../constants';
import { useAuthContext } from '../../contexts';
import type { UserType } from '../../types';



const RequireRole = ({ allowedRoles }: { allowedRoles: UserType[] }) => {
    const { userType, hasExistingLoggedInUser } = useAuthContext();
    const { isUserLoggedIn, existingLoggedInData } = hasExistingLoggedInUser();

    const resolvedUserType = existingLoggedInData?.userType || userType;
  
    if (!isUserLoggedIn || !resolvedUserType) {
        return <Navigate to={AUTH} replace />;
    }
  
    if (!allowedRoles.includes(resolvedUserType)) {
        return <Navigate to={UNAUTHORIZED} replace />;
    }
  
    /*
        Note to future self:
        How <Outlet/> works: https://chatgpt.com/share/6967e2c6-6ca0-8012-a38c-57ab5ee59883 
    */
    return <Outlet />;
};

export default RequireRole;
  