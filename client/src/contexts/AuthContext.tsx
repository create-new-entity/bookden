
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isLoggedInUserData, type AuthContextType, type LoggedInUserData } from '../types/index.ts';
import { LOGGED_IN_USER_DATA } from '../constants/authContext.ts';
import { useNavigate } from 'react-router-dom';


/*
    hasExistingLoggedInUser is needed not to unncessarily redirect user to auth page.
    Sometimes it takes extra 1 or 2 renders before the actual logged in data is in loggedInUserData state of AuthProvider.
    Because of that logged in user may get pushed to auth page,
    if a user directly pastes the link in browser of a page that requires authentication.
    Example: Someone instead of logging in and navigating to the profile page directly pastes profile page url in the browser.
*/

const hasExistingLoggedInUser = () => {
    const loggedInUserData = localStorage.getItem(LOGGED_IN_USER_DATA);
    if(loggedInUserData) {
        const existingLoggedInData = JSON.parse(loggedInUserData);
        if(isLoggedInUserData(existingLoggedInData)){
            return {
                isUserLoggedIn: true,
                existingLoggedInData
            };
        }
    }
    return {
        isUserLoggedIn: false,
        existingLoggedInData: null
    };
};

const defaultContextValue: AuthContextType = {
    token: '',
    username: '',
    userType: 'customer',
    isLoggedIn: false,
    handleLoggedInContext: (_data: LoggedInUserData) => {},
    handleLoggedOutContext: () => {},
    hasExistingLoggedInUser
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserData, setLoggedInUserData] = useState<LoggedInUserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { isUserLoggedIn, existingLoggedInData } = hasExistingLoggedInUser();
        if(isUserLoggedIn) {
            setLoggedInUserData(existingLoggedInData);
        }
    }, []);

    const handleLoggedInContext = (newLoggedInUserData: LoggedInUserData) => {
        setLoggedInUserData(newLoggedInUserData);
        localStorage.setItem(LOGGED_IN_USER_DATA, JSON.stringify(newLoggedInUserData));
    };

    const handleLoggedOutContext = () => {
        setLoggedInUserData(null);
        localStorage.removeItem(LOGGED_IN_USER_DATA);
        navigate('/auth');
    };

    const value: AuthContextType = {
        username: loggedInUserData?.username || '',
        token: loggedInUserData?.token || '',
        userType: loggedInUserData?.userType || undefined,
        isLoggedIn: !!(loggedInUserData && loggedInUserData.token),
        handleLoggedInContext,
        handleLoggedOutContext,
        hasExistingLoggedInUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useAuthContext;