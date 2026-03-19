import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';


/* 
    Note to future self:

    When to use 'userEvent' vs 'fireEvent': https://chatgpt.com/share/69725505-cc7c-8012-9c6c-9d4b27ff2fc4

*/

const mockSignUp = vi.fn();
const mockLogin = vi.fn();

vi.mock('../api', () => ({
    signUp: (payload: unknown) => mockSignUp(payload),
    login: (payload: unknown) => mockLogin(payload),
}));

vi.mock('embla-carousel-react', () => ({
    default: () => [() => {}, null],
}));

import LogInPage from '../pages/LogInPage';

const renderPage = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <LogInPage />
            </BrowserRouter>
        </QueryClientProvider>
    );
};

describe('Signup flow', () => {
    test('user can sign up with valid credentials', async () => {
        const user = userEvent.setup();

        renderPage();

        await user.click(
            screen.getByRole('tab', { name: /sign up/i })
        );

        
        await user.type(screen.getByLabelText(/username/i), 'customer0');
        await user.type(screen.getByLabelText(/email/i), 'customer0@gmail.com');
        await user.type(screen.getByLabelText(/^password$/i), 'verystrongpasword0');
        await user.type(screen.getByLabelText(/confirm password/i), 'verystrongpasword0');

        await user.click(
            screen.getByRole('button', { name: /sign up/i })
        );

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledTimes(1);
            expect(mockSignUp).toHaveBeenCalledWith({
                username: 'customer0',
                email: 'customer0@gmail.com',
                password: 'verystrongpasword0',
                userType: 'customer'
            });
        });
    }) ;
});
