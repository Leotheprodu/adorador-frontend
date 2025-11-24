import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

// Mocks
jest.mock('@nanostores/react', () => ({
    useStore: jest.fn(),
}));

jest.mock('../../_hooks/useLoginForm', () => ({
    useLoginForm: jest.fn(),
}));

// Mock child components to simplify testing the container logic
jest.mock('../InputPhoneLoginForm', () => ({
    InputPhoneLoginForm: () => <div data-testid="input-phone">Input Phone</div>,
}));
jest.mock('../InputPasswordLoginForm', () => ({
    InputPasswordLoginForm: () => (
        <div data-testid="input-password">Input Password</div>
    ),
}));
jest.mock('../IsLoggedInHandle', () => ({
    IsLoggedInHandle: () => <div>User is logged in</div>,
}));

// Mock shared UI components
jest.mock('../../../_components/ui/AuthCard', () => ({
    AuthCard: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="auth-card">{children}</div>
    ),
}));
jest.mock('../../../_components/ui/AuthHeader', () => ({
    AuthHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));
jest.mock('../../../_components/ui/AuthFooter', () => ({
    AuthFooter: () => <div>Auth Footer</div>,
}));

// Mock NextUI Button
jest.mock('@nextui-org/react', () => ({
    Button: ({
        children,
        onClick,
        type,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        type?: 'button' | 'submit' | 'reset';
    }) => (
        <button onClick={onClick} type={type}>
            {children}
        </button>
    ),
}));

import { useStore } from '@nanostores/react';
import { useLoginForm } from '../../_hooks/useLoginForm';

describe('LoginForm', () => {
    const mockHandleLogin = jest.fn((e) => e.preventDefault());
    const mockUseLoginForm = {
        handleOnChange: jest.fn(),
        handleOnClear: jest.fn(),
        handleLogin: mockHandleLogin,
        isInvalidPass: false,
        phone: '',
        password: '',
        isPending: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useLoginForm as jest.Mock).mockReturnValue(mockUseLoginForm);
    });

    it('renders login form when user is NOT logged in', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: false });

        render(<LoginForm />);

        expect(screen.getByTestId('auth-card')).toBeInTheDocument();
        expect(screen.getByText('Bienvenido')).toBeInTheDocument();
        expect(screen.getByTestId('input-phone')).toBeInTheDocument();
        expect(screen.getByTestId('input-password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /iniciar sesión/i })
        ).toBeInTheDocument();
        expect(screen.getByText('Auth Footer')).toBeInTheDocument();
    });

    it('renders IsLoggedInHandle when user IS logged in', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: true });

        render(<LoginForm />);

        expect(screen.getByText('User is logged in')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-card')).not.toBeInTheDocument();
    });

    it('calls handleLogin on form submission', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: false });
        render(<LoginForm />);

        const submitButton = screen.getByRole('button', {
            name: /iniciar sesión/i,
        });
        fireEvent.click(submitButton);

        expect(mockHandleLogin).toHaveBeenCalled();
    });
});
