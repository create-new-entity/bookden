import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import theme from '../theme/theme.ts';
import { AuthProvider } from '../contexts/AuthContext.tsx';
import { NavProvider } from '../contexts/NavContext.tsx';

const queryClient = new QueryClient();

type Props = { children: ReactNode };

export const AppProviders = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <AuthProvider>
                        <NavProvider>
                            {children}
                        </NavProvider>
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
};
