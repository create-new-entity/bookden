
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOGGED_IN_USER_DATA } from '../constants';
import { isLoggedInUserData, type AuthContextType } from '../types';
import { useMe } from '../hooks';


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
    userId: -1,
    token: '',
    username: '',
    email: '',
    userType: 'customer',
    isLoggedIn: false,
    saveToken: (_token: string) => {},
    clearAuthentication: () => {},
    hasExistingLoggedInUser
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string>('');
    const me = useMe(token);
    const navigate = useNavigate();

    useEffect(() => {
        const { isUserLoggedIn, existingLoggedInData } = hasExistingLoggedInUser();
        if(isUserLoggedIn) {
            setToken(existingLoggedInData?.token || '');
        }
    }, []);

    useEffect(() => {
        if(me.isSuccess && !me.isLoading && token) {
            localStorage.setItem(LOGGED_IN_USER_DATA, JSON.stringify({
                username: me.data?.username || '',
                email: me.data?.email,
                userType: me.data?.userType,
                token
            }));
        }
    }, [me.isSuccess, me.isLoading, token, me.data?.username, me.data?.email, me.data?.userType]);
    

    const saveToken = (token: string) => {
        setToken(token);
    };


    const clearAuthentication = () => {
        setToken('');
        localStorage.removeItem(LOGGED_IN_USER_DATA);
        navigate('/auth');
    };

    const value: AuthContextType = {
        userId: me.data?.userId || 0,
        username: me.data?.username || '',
        token,
        userType: me.data?.userType || undefined,
        email: me.data?.email || '',
        isLoggedIn: !!token,
        saveToken,
        clearAuthentication,
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