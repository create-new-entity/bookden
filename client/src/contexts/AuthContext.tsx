
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { isLoggedInUserData, type AuthContextType, type LoggedInUserData } from '../types/index.ts';
import { LOGGED_IN_USER_DATA } from '../constants/authContext.ts';

const defaultContextValue: AuthContextType = {
    token: '',
    userType: 'customer',
    isLoggedIn: false,
    handleLoggedInContext: (_data: LoggedInUserData) => {},
    handleLoggedOutContext: () => {}
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUserData, setLoggedInUserData] = useState<LoggedInUserData | null>(null);

    useEffect(() => {
        const loggedInUserData = localStorage.getItem(LOGGED_IN_USER_DATA);
        if(loggedInUserData){
            const existingLoggedInData = JSON.parse(loggedInUserData);
            if(isLoggedInUserData(existingLoggedInData)){
                setLoggedInUserData(existingLoggedInData);
            }
        }
    }, []);

    const handleLoggedInContext = (newLoggedInUserData: LoggedInUserData) => {
        setLoggedInUserData(newLoggedInUserData);
        localStorage.setItem(LOGGED_IN_USER_DATA, JSON.stringify(newLoggedInUserData));
    };

    const handleLoggedOutContext = () => {
        setLoggedInUserData(null);
        localStorage.removeItem(LOGGED_IN_USER_DATA);
    };

    const value: AuthContextType = {
        token: loggedInUserData?.token || null,
        userType: loggedInUserData?.userType || undefined,
        isLoggedIn: !!(loggedInUserData && loggedInUserData.token),
        handleLoggedInContext,
        handleLoggedOutContext
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