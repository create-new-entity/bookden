import { createContext, useContext, useState, type ReactNode } from 'react';
import { PLACE_HOLDER_AVATAR } from '../constants';
import type { AvatarContextValue } from '../types';

const defaultValue: AvatarContextValue = {
    avatarUrl: null,
    setAvatarUrl: () => {}
};

const AvatarContext = createContext(defaultValue);

export const AvatarProvider = ({ children } : { children: ReactNode }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultValue.avatarUrl);
    
    const value = {
        avatarUrl,
        setAvatarUrl
    };

    return (
        <AvatarContext.Provider value={value}>
            {children}
        </AvatarContext.Provider>
    );
};

const useAvatarContext = () => {
    return useContext(AvatarContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useAvatarContext;

