import { render, screen } from '@testing-library/react';
import { AuthCard } from '../AuthCard';
import { AuthHeader } from '../AuthHeader';
import { AuthFooter } from '../AuthFooter';

// Mock NextUI Link since it might cause issues in tests if not mocked or if it relies on context
jest.mock('@nextui-org/react', () => ({
    Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}));

describe('Auth UI Components', () => {
    describe('AuthCard', () => {
        it('renders children correctly', () => {
            render(
                <AuthCard>
                    <div data-testid="child">Child Content</div>
                </AuthCard>
            );
            expect(screen.getByTestId('child')).toBeInTheDocument();
            expect(screen.getByText('Child Content')).toBeInTheDocument();
        });
    });

    describe('AuthHeader', () => {
        it('renders title and subtitle correctly', () => {
            render(<AuthHeader title="Test Title" subtitle="Test Subtitle" />);
            expect(screen.getByText('Test Title')).toBeInTheDocument();
            expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
        });

        it('renders default emoji', () => {
            render(<AuthHeader title="Title" subtitle="Subtitle" />);
            expect(screen.getByText('🎵')).toBeInTheDocument();
        });

        it('renders custom emoji', () => {
            render(<AuthHeader title="Title" subtitle="Subtitle" emoji="🚀" />);
            expect(screen.getByText('🚀')).toBeInTheDocument();
        });
    });

    describe('AuthFooter', () => {
        it('renders login mode links correctly', () => {
            render(<AuthFooter mode="login" />);
            expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
            expect(screen.getByText('Regístrate gratis')).toBeInTheDocument();
            expect(screen.getByText('¿No tienes cuenta?')).toBeInTheDocument();
        });

        it('renders signup mode links correctly', () => {
            render(<AuthFooter mode="signup" />);
            expect(
                screen.queryByText('¿Olvidaste tu contraseña?')
            ).not.toBeInTheDocument();
            expect(screen.getByText('Inicia sesión')).toBeInTheDocument();
            expect(screen.getByText('¿Ya tienes una cuenta?')).toBeInTheDocument();
        });
    });
});
