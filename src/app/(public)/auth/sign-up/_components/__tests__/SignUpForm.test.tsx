import { render, screen, fireEvent } from '@testing-library/react';
import { SignUpForm } from '../SignUpForm';

// Mocks
jest.mock('@nanostores/react', () => ({
    useStore: jest.fn(),
}));

jest.mock('../../_hooks/useSignUpForm', () => ({
    useSignUpForm: jest.fn(),
}));
jest.mock('../WhatsAppVerificationComponent', () => ({
    WhatsAppVerificationComponent: () => <div>WhatsApp Verification</div>,
}));
jest.mock('@auth/login/_components/InputPasswordLoginForm', () => ({
    InputPasswordLoginForm: () => <div>Input Password</div>,
}));
jest.mock('@auth/login/_components/IsLoggedInHandle', () => ({
    IsLoggedInHandle: () => <div>User is logged in</div>,
}));

// Mock child components
jest.mock('@auth/sign-up/_components/InputUsernameSignUpForm', () => ({
    InputUsernameSignUpForm: () => <div>Input Username</div>,
}));
jest.mock('@auth/sign-up/_components/InputEmailSignUpForm', () => ({
    InputEmailSignUpForm: () => <div>Input Email</div>,
}));
jest.mock('../InputPhoneSignUpForm', () => ({
    InputPhoneSignUpForm: () => <div>Input Phone</div>,
}));
jest.mock('../InputBirthdateSignUpForm', () => ({
    InputBirthdateSignUpForm: () => <div>Input Birthdate</div>,
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
jest.mock('@heroui/react', () => ({
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
import { useSignUpForm } from '../../_hooks/useSignUpForm';

describe('SignUpForm', () => {
    const mockHandleSignUp = jest.fn((e) => e.preventDefault());
    const mockUseSignUpForm = {
        handleOnChange: jest.fn(),
        handleOnClear: jest.fn(),
        handleSignUp: mockHandleSignUp,
        isInvalidPass: false,
        phone: '',
        password: '',
        password2: '',
        email: '',
        birthdate: '',
        isPending: false,
        username: '',
        noFormValue: {},
        data: null,
        status: 'idle',
        dataPhone: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useSignUpForm as jest.Mock).mockReturnValue(mockUseSignUpForm);
    });

    it('renders signup form when user is NOT logged in', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: false });

        render(<SignUpForm />);

        expect(screen.getByTestId('auth-card')).toBeInTheDocument();
        expect(screen.getByText('¡Únete Ahora!')).toBeInTheDocument();
        expect(screen.getByText('Input Username')).toBeInTheDocument();
        expect(screen.getByText('Input Email')).toBeInTheDocument();
        expect(screen.getByText('Input Phone')).toBeInTheDocument();
        expect(screen.getByText('Input Birthdate')).toBeInTheDocument();
        expect(screen.getAllByText('Input Password')).toHaveLength(2); // Password and Confirm Password
        expect(
            screen.getByRole('button', { name: /crear cuenta gratis/i })
        ).toBeInTheDocument();
        expect(screen.getByText('Auth Footer')).toBeInTheDocument();
    });

    it('renders IsLoggedInHandle when user IS logged in', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: true });

        render(<SignUpForm />);

        expect(screen.getByText('User is logged in')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-card')).not.toBeInTheDocument();
    });

    it('renders WhatsAppVerificationComponent on success', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: false });
        (useSignUpForm as jest.Mock).mockReturnValue({
            ...mockUseSignUpForm,
            status: 'success',
            data: { verificationToken: '123', whatsappMessage: 'msg' },
        });

        render(<SignUpForm />);

        expect(screen.getByText('WhatsApp Verification')).toBeInTheDocument();
        expect(screen.queryByTestId('auth-card')).not.toBeInTheDocument();
    });

    it('calls handleSignUp on form submission', () => {
        (useStore as jest.Mock).mockReturnValue({ isLoggedIn: false });
        render(<SignUpForm />);

        const submitButton = screen.getByRole('button', {
            name: /crear cuenta gratis/i,
        });
        fireEvent.click(submitButton);

        expect(mockHandleSignUp).toHaveBeenCalled();
    });
});
