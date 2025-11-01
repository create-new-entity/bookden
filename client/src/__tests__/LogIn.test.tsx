

import { render, screen } from '@testing-library/react';
import LogIn from '../pages/LogInPage';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

test('Renders login form fields', () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LogIn />
            </BrowserRouter>
        </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});
