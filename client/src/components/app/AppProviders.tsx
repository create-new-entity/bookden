import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import {
    NavProvider, AvatarProvider,
    AuthProvider, ThemeModeProvider,
    useThemeModeContext, NotificationProvider, CartProvider
} from '../../contexts';

const queryClient = new QueryClient();

type Props = { children: ReactNode };

const WrapperComponent = ({ children }: Props) => {
    const { theme } = useThemeModeContext();
    return (
        /*
        
            Welcome to "Provider Hell" 😎.

            Note to future self to refactor later:
            https://medium.com/@d3d.me/react-provider-composition-exorcising-provider-hell-d98cd3a78b29

        */
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
                <NotificationProvider>
                    <AuthProvider>
                        <AvatarProvider>
                            <CartProvider>
                                <NavProvider>
                                    {children}
                                </NavProvider>
                            </CartProvider>
                        </AvatarProvider>
                    </AuthProvider>
                </NotificationProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

const AppProviders = ({ children }: Props) => {
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

export default AppProviders;
