
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const mockLogin = vi.fn();
const mockSignUp = vi.fn();

vi.mock('../api', () => ({
    signUp: (payload: unknown) => mockSignUp(payload),
    login: (payload: unknown) => mockLogin(payload),
}));

vi.mock('embla-carousel-react', () => ({
    default: () => [() => {}, null],
}));

import LogInPage from '../pages/LogInPage';
import userEvent from '@testing-library/user-event';


const queryClient = new QueryClient();

const renderLogInComponent = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LogInPage />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('Login flow', () => {
    test('Login form renders and sends valid credentials to API function', async () => {
        const user = userEvent.setup();
        renderLogInComponent();
    
        await user.click(
            screen.getByRole('tab', { name: /log in/i })
        );
    
        await user.type(screen.getByLabelText(/username/i), 'customer0');
        await user.type(screen.getByLabelText(/password/i), 'verystrongpasword0');
    
        await user.click(
            screen.getByRole('button', { name: /log in/i })
        );
    
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
            expect(mockLogin).toHaveBeenCalledWith({
                username: 'customer0',
                password: 'verystrongpasword0',
            });
        });
    });    
});