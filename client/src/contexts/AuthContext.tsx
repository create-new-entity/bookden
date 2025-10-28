
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthContextType } from '../types.ts';
import { BOOKDEN_TOKEN } from '../constants/authContext.ts';


const defaultContextValue: AuthContextType = {
    token: null,
    isLoggedIn: false,
    handleLoggedInContext: () => {},
    handleLoggedOutContext: () => {}
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    const handleLoggedInContext = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem(BOOKDEN_TOKEN, newToken);
    };

    const handleLoggedOutContext = () => {
        setToken(null);
        localStorage.removeItem(BOOKDEN_TOKEN);
    };

    const value: AuthContextType = {
        token,
        isLoggedIn: !!token,
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