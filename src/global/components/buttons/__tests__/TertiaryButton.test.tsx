import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TertiaryButton } from '../TertiaryButton';

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
jest.mock('@heroui/react', () => ({
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

describe('TertiaryButton', () => {
  describe('Component Rendering', () => {
    it('should render as a link when href is provided', () => {
      render(<TertiaryButton href="/ayuda">¿Necesitas ayuda?</TertiaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/ayuda');
      expect(link).toHaveTextContent('¿Necesitas ayuda?');
    });

    it('should render as a button when onClick is provided', () => {
      const handleClick = jest.fn();
      render(<TertiaryButton onClick={handleClick}>Omitir</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Omitir');
    });

    it('should render as a button when neither href nor onClick is provided', () => {
      render(<TertiaryButton>Action</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Action');
    });
  });

  describe('Styling', () => {
    it('should apply text-only brand purple classes to button', () => {
      render(<TertiaryButton onClick={() => {}}>Test</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-brand-purple-600');
      expect(button.className).toContain('font-semibold');
    });

    it('should apply hover classes for text and underline', () => {
      render(<TertiaryButton onClick={() => {}}>Test</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:text-brand-purple-700');
      expect(button.className).toContain('hover:underline');
    });

    it('should merge custom className with base classes', () => {
      render(
        <TertiaryButton onClick={() => {}} className="text-red-600">
          Test
        </TertiaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-transparent');
      expect(button.className).toContain('text-red-600');
    });

    it('should render link when href is provided', () => {
      render(<TertiaryButton href="/test">Test</TertiaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward endContent prop', () => {
      render(
        <TertiaryButton href="/test" endContent={<span>?</span>}>
          Más info
        </TertiaryButton>,
      );

      expect(screen.getByText('Más info')).toBeInTheDocument();
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('should forward startContent prop', () => {
      render(
        <TertiaryButton href="/test" startContent={<span>←</span>}>
          Back
        </TertiaryButton>,
      );

      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('←')).toBeInTheDocument();
    });

    it('should forward type prop', () => {
      render(<TertiaryButton type="button">Button</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should forward isLoading prop', () => {
      render(<TertiaryButton isLoading={true}>Loading...</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });

    it('should forward disabled prop', () => {
      render(<TertiaryButton disabled>Disabled</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should forward isDisabled prop', () => {
      render(<TertiaryButton isDisabled>Disabled</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<TertiaryButton onClick={handleClick}>Click me</TertiaryButton>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <TertiaryButton onClick={handleClick} disabled>
          Disabled
        </TertiaryButton>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Use Cases', () => {
    it('should work as a help link', () => {
      render(<TertiaryButton href="/ayuda">¿Necesitas ayuda?</TertiaryButton>);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/ayuda');
      expect(link).toHaveTextContent('¿Necesitas ayuda?');
    });

    it('should work as a skip button', () => {
      const handleSkip = jest.fn();
      render(<TertiaryButton onClick={handleSkip}>Omitir</TertiaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Omitir');
    });

    it('should work with custom color for password reset', () => {
      render(
        <TertiaryButton href="/reset" className="text-red-600">
          ¿Olvidaste tu contraseña?
        </TertiaryButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/reset');
      expect(link).toHaveTextContent('¿Olvidaste tu contraseña?');
    });
  });
});
