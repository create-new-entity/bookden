import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import theme from './theme/theme.ts';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { NavProvider } from './contexts/NavContext.tsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <AuthProvider>
                        <NavProvider>
                            <App />
                        </NavProvider>
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
