
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Theme } from '@mui/material';
import { getTheme } from '../theme/theme';

type ThemeMode = 'light' | 'dark'

type ThemeModeContextvalue = {
    theme: Theme;
    switchMode: () => void
};

const defaultContextValue: ThemeModeContextvalue = {
    theme: getTheme('light'),
    switchMode: () => {}
};

const ThemeModeContext = createContext(defaultContextValue);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    const switchMode = () => {
        setThemeMode((prevMode) => {
            if(prevMode === 'light') {
                return 'dark';
            }
            return 'light';
        });
    };
    
    const value: ThemeModeContextvalue = {
        theme: getTheme(themeMode),
        switchMode
    };

    return (
        <ThemeModeContext.Provider value={value}>
            {children}
        </ThemeModeContext.Provider>
    );
};

const useThemeModeContext = () => {
    return useContext(ThemeModeContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export default useThemeModeContext;