import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrimaryButton } from '../PrimaryButton';

// Mock Next.js Link
// eslint-disable-next-line react/display-name
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock NextUI Button
jest.mock('@nextui-org/react', () => ({
  Button: ({
    children,
    as,
    className,
    endContent,
    startContent,
    isLoading,
    isDisabled,
    disabled,
    type,
    onClick,
    onPress,
    ...props
  }: {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    endContent?: React.ReactNode;
    startContent?: React.ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    onPress?: () => void;
    [key: string]: unknown;
  }) => {
    const isButtonDisabled = isDisabled || disabled || isLoading;

    if (as) {
      const Component = as;
      return (
        <Component
          className={className}
          disabled={isButtonDisabled}
          data-loading={isLoading}
          onClick={onClick}
          {...props}
        >
          {startContent}
          {children}
          {endContent}
        </Component>
      );
    }
    return (
      <button
        className={className}
        disabled={isButtonDisabled}
        data-loading={isLoading}
        type={type}
        onClick={onClick || onPress}
        {...props}
      >
        {startContent}
        {children}
        {endContent}
      </button>
    );
  },
}));

describe('PrimaryButton', () => {
  describe('Component Rendering', () => {
    it('should render as a link when href is provided', () => {
      render(<PrimaryButton href="/auth/login">Iniciar sesión</PrimaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/auth/login');
      expect(link).toHaveTextContent('Iniciar sesión');
    });

    it('should render as a button when onClick is provided', () => {
      const handleClick = jest.fn();
      render(<PrimaryButton onClick={handleClick}>Guardar</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Guardar');
    });

    it('should render as a button when neither href nor onClick is provided', () => {
      render(<PrimaryButton>Submit</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Submit');
    });
  });

  describe('Styling', () => {
    it('should apply gradient primary classes to button', () => {
      render(<PrimaryButton onClick={() => {}}>Test</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-primary');
      expect(button.className).toContain('text-white');
      expect(button.className).toContain('font-semibold');
    });

    it('should apply hover classes', () => {
      render(<PrimaryButton onClick={() => {}}>Test</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:scale-105');
      expect(button.className).toContain('hover:shadow-xl');
    });

    it('should merge custom className with base classes', () => {
      render(
        <PrimaryButton onClick={() => {}} className="custom-class">
          Test
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-gradient-primary');
      expect(button.className).toContain('custom-class');
    });

    it('should render link when href is provided', () => {
      render(<PrimaryButton href="/test">Test</PrimaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward endContent prop', () => {
      render(
        <PrimaryButton href="/test" endContent={<span>→</span>}>
          Continue
        </PrimaryButton>,
      );

      expect(screen.getByText('Continue')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('should forward startContent prop', () => {
      render(
        <PrimaryButton href="/test" startContent={<span>←</span>}>
          Back
        </PrimaryButton>,
      );

      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('←')).toBeInTheDocument();
    });

    it('should forward type prop for form buttons', () => {
      render(<PrimaryButton type="submit">Submit Form</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should forward isLoading prop', () => {
      render(<PrimaryButton isLoading={true}>Loading...</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled(); // isLoading should disable the button
    });

    it('should forward disabled prop', () => {
      render(<PrimaryButton disabled>Disabled</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should forward isDisabled prop', () => {
      render(<PrimaryButton isDisabled>Disabled</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <PrimaryButton onClick={handleClick} disabled>
          Disabled
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Use Cases', () => {
    it('should work as a navigation link', () => {
      render(<PrimaryButton href="/auth/register">Crear cuenta</PrimaryButton>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/auth/register');
      expect(link).toHaveTextContent('Crear cuenta');
    });

    it('should work as a form submit button', () => {
      render(
        <PrimaryButton type="submit" isLoading={false}>
          Guardar cambios
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).toHaveTextContent('Guardar cambios');
    });

    it('should work as an action button with loading state', () => {
      render(
        <PrimaryButton onClick={() => {}} isLoading={true}>
          Procesando...
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled(); // Should be disabled when loading
    });

    it('should work with onPress (NextUI style)', () => {
      const handlePress = jest.fn();
      render(<PrimaryButton onPress={handlePress}>Press me</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });
});
