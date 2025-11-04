
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Theme } from '@mui/material';
import { getTheme } from '../theme/theme';

type ThemeMode = 'light' | 'dark'

type ThemeModeContextvalue = {
    isLightMode: boolean;
    theme: Theme;
    handleThemeModeSwitch: () => void;
};

const defaultContextValue: ThemeModeContextvalue = {
    isLightMode: true,
    theme: getTheme('light'),
    handleThemeModeSwitch: () => {}
};

const ThemeModeContext = createContext(defaultContextValue);

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    const handleThemeModeSwitch = () => {
        setThemeMode((prevMode) => {
            if(prevMode === 'light') {
                return 'dark';
            }
            return 'light';
        });
    };
    
    const value: ThemeModeContextvalue = {
        isLightMode: themeMode === 'light',
        theme: getTheme(themeMode),
        handleThemeModeSwitch
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