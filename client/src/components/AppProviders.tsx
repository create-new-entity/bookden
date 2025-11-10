import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext.tsx';
import { NavProvider } from '../contexts/NavContext.tsx';
import useThemeModeContext, { ThemeModeProvider } from '../contexts/ThemeModeContext.tsx';
import { AvatarProvider } from '../contexts/AvatarContext.tsx';

const queryClient = new QueryClient();

type Props = { children: ReactNode };

const WrapperComponent = ({ children }: Props) => {
    const { theme } = useThemeModeContext();
    return (
        /*
            Welcome to "Provider Hell" 😎.
        */
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <AvatarProvider>
                        <NavProvider>
                            {children}
                        </NavProvider>
                    </AvatarProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export const AppProviders = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeModeProvider>
                <WrapperComponent>
                    { children }
                </WrapperComponent>
            </ThemeModeProvider>
        </QueryClientProvider>
    );
};
