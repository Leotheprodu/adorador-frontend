import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecondaryButton } from '../SecondaryButton';

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

describe('SecondaryButton', () => {
  describe('Component Rendering', () => {
    it('should render as a link when href is provided', () => {
      render(<SecondaryButton href="/demo">Ver demo</SecondaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/demo');
      expect(link).toHaveTextContent('Ver demo');
    });

    it('should render as a button when onClick is provided', () => {
      const handleClick = jest.fn();
      render(<SecondaryButton onClick={handleClick}>Cancelar</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Cancelar');
    });

    it('should render as a button when neither href nor onClick is provided', () => {
      render(<SecondaryButton>Action</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Action');
    });
  });

  describe('Styling', () => {
    it('should apply border and white background classes to button', () => {
      render(<SecondaryButton onClick={() => {}}>Test</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-slate-200');
      expect(button.className).toContain('bg-white');
      expect(button.className).toContain('text-slate-700');
      expect(button.className).toContain('font-semibold');
    });

    it('should apply hover classes for background and border', () => {
      render(<SecondaryButton onClick={() => {}}>Test</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:bg-brand-purple-50');
      expect(button.className).toContain('hover:border-brand-purple-300');
    });

    it('should merge custom className with base classes', () => {
      render(
        <SecondaryButton onClick={() => {}} className="border-white text-white">
          Test
        </SecondaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('border-2');
      expect(button.className).toContain('border-white');
      expect(button.className).toContain('text-white');
    });

    it('should render link when href is provided', () => {
      render(<SecondaryButton href="/test">Test</SecondaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Props Forwarding', () => {
    it('should forward endContent prop', () => {
      render(
        <SecondaryButton href="/test" endContent={<span>→</span>}>
          Ver más
        </SecondaryButton>,
      );

      expect(screen.getByText('Ver más')).toBeInTheDocument();
      expect(screen.getByText('→')).toBeInTheDocument();
    });

    it('should forward startContent prop', () => {
      render(
        <SecondaryButton href="/test" startContent={<span>←</span>}>
          Back
        </SecondaryButton>,
      );

      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('←')).toBeInTheDocument();
    });

    it('should forward type prop', () => {
      render(<SecondaryButton type="button">Button</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should forward isLoading prop', () => {
      render(<SecondaryButton isLoading={true}>Loading...</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });

    it('should forward disabled prop', () => {
      render(<SecondaryButton disabled>Disabled</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should forward isDisabled prop', () => {
      render(<SecondaryButton isDisabled>Disabled</SecondaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<SecondaryButton onClick={handleClick}>Click me</SecondaryButton>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <SecondaryButton onClick={handleClick} disabled>
          Disabled
        </SecondaryButton>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Use Cases', () => {
    it('should work as a navigation link with custom border', () => {
      render(
        <SecondaryButton href="/recursos" className="border-white text-white">
          Explorar recursos
        </SecondaryButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/recursos');
      expect(link).toHaveTextContent('Explorar recursos');
    });

    it('should work as a cancel button', () => {
      const handleCancel = jest.fn();
      render(
        <SecondaryButton onClick={handleCancel}>Cancelar</SecondaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Cancelar');
    });

    it('should work with arrow icon as endContent', () => {
      render(
        <SecondaryButton
          href="/discipulado"
          endContent={<span className="text-lg">→</span>}
        >
          Ver todos los recursos
        </SecondaryButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveTextContent('Ver todos los recursos');
      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });
});
