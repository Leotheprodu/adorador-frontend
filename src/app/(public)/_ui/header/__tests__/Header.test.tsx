// Mock nanostores first - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn((store) => store?.get?.() || null),
}));

// Mock NextUI components
jest.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    disabled,
    isLoading,
    className = '',
    ...props
  }: React.PropsWithChildren<{
    onPress?: () => void;
    isDisabled?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
  }>) => (
    <button
      onClick={onPress}
      disabled={isDisabled || disabled}
      data-disabled={isDisabled || disabled ? 'true' : undefined}
      data-loading={isLoading ? 'true' : undefined}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Dropdown: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DropdownTrigger: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
  DropdownMenu: ({ children }: React.PropsWithChildren) => (
    <div role="menu">{children}</div>
  ),
  DropdownItem: ({
    children,
    onPress,
  }: React.PropsWithChildren<{ onPress?: () => void }>) => (
    <div role="menuitem" onClick={onPress}>
      {children}
    </div>
  ),
}));

import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

// Mock constants
jest.mock('@global/config/constants', () => ({
  appName: 'Test App Name',
}));

// Mock Next.js components
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

// Mock ThemeToggle
jest.mock('@global/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock ResponsiveNavBar
jest.mock('@ui/header/components/ResponsiveNavBar', () => ({
  ResponsiveNavBar: () => (
    <nav data-testid="responsive-navbar">Responsive NavBar</nav>
  ),
}));

// Mock NotificationBell
jest.mock('@ui/header/components/NotificationBell', () => ({
  NotificationBell: () => (
    <div data-testid="notification-bell">Notification Bell</div>
  ),
}));

describe('Header Component', () => {
  describe('Structure and Layout', () => {
    it('should render header element with correct classes', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('fixed');
      expect(header).toHaveClass('z-40');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('h-[5rem]');
      expect(header).toHaveClass('w-screen');
      expect(header).toHaveClass('bg-white/80');
      expect(header).toHaveClass('dark:bg-gray-900/80');
    });

    it('should apply positioning and spacing classes', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('items-center');
      expect(header).toHaveClass('justify-between');
      expect(header).toHaveClass('px-5');
      expect(header).toHaveClass('sm:px-20');
    });

    it('should apply backdrop blur classes for responsive design', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-md');
      expect(header).toHaveClass('transition-all');
    });

    it('should have shadow styling and border', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('shadow-lg');
      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('border-brand-purple-100/50');
      expect(header).toHaveClass('dark:border-brand-purple-800/50');
    });
  });

  describe('Logo and Brand', () => {
    it('should render logo image', () => {
      render(<Header />);

      const logo = screen.getByAltText('Test App Name');
      expect(logo).toBeInTheDocument();
    });

    it('should render logo with correct src', () => {
      render(<Header />);

      const logo = screen.getByAltText('Test App Name');
      expect(logo).toHaveAttribute('src', '/logo_zamr.webp');
    });

    it('should render logo with correct dimensions', () => {
      render(<Header />);

      const logo = screen.getByAltText('Test App Name');
      expect(logo).toHaveAttribute('width', '100');
      expect(logo).toHaveAttribute('height', '100');
    });

    it('should apply correct classes to logo', () => {
      render(<Header />);

      const logo = screen.getByAltText('Test App Name');
      expect(logo).toHaveClass('h-20');
      expect(logo).toHaveClass('w-auto');
      expect(logo).toHaveClass('object-contain');
    });
  });

  describe('Home Link', () => {
    it('should render link to home page', () => {
      render(<Header />);

      const homeLink = screen.getByRole('link');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should wrap logo in home link', () => {
      render(<Header />);

      const homeLink = screen.getByRole('link');
      const logo = screen.getByAltText('Test App Name');

      expect(homeLink).toContainElement(logo);
    });

    it('should apply flex layout to link', () => {
      render(<Header />);

      const homeLink = screen.getByRole('link');
      expect(homeLink).toHaveClass('flex');
      expect(homeLink).toHaveClass('items-center');
      expect(homeLink).toHaveClass('justify-center');
      expect(homeLink).toHaveClass('gap-2');
    });
  });

  describe('Navigation', () => {
    it('should render ResponsiveNavBar component', () => {
      render(<Header />);

      const navbar = screen.getByTestId('responsive-navbar');
      expect(navbar).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('should use header tag as wrapper', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should contain link for navigation', () => {
      render(<Header />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have alt text for logo image', () => {
      render(<Header />);

      const logo = screen.getByAltText('Test App Name');
      expect(logo).toBeInTheDocument();
    });

    it('should have link with href for keyboard navigation', () => {
      render(<Header />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('Integration', () => {
    it('should render all elements together correctly', () => {
      render(<Header />);

      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByAltText('Test App Name')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-navbar')).toBeInTheDocument();
    });

    it('should maintain correct visual hierarchy', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      const link = screen.getByRole('link');
      const navbar = screen.getByTestId('responsive-navbar');

      expect(header).toContainElement(link);
      expect(header).toContainElement(navbar);
    });
  });

  describe('Responsive Design', () => {
    it('should have mobile padding classes', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('px-5');
    });

    it('should have tablet/desktop padding classes', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('sm:px-20');
    });

    it('should have responsive background opacity with dark mode support', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white/80');
      expect(header).toHaveClass('dark:bg-gray-900/80');
    });

    it('should have responsive backdrop blur', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-md');
    });
  });

  describe('Mobile Component Visibility Integration', () => {
    it('should render ThemeToggle, NotificationBell and ResponsiveNavBar', () => {
      render(<Header />);

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-navbar')).toBeInTheDocument();
    });

    it('should place all components in the same container with gap', () => {
      render(<Header />);

      const themeToggle = screen.getByTestId('theme-toggle');
      const notificationBell = screen.getByTestId('notification-bell');
      const navbar = screen.getByTestId('responsive-navbar');

      // Todos deben estar en el mismo contenedor padre
      const commonParent = themeToggle.parentElement;
      expect(commonParent).toContainElement(notificationBell);
      expect(commonParent).toContainElement(navbar);

      // El contenedor debe tener gap-3 para separarlos
      expect(commonParent).toHaveClass('gap-3');
      expect(commonParent).toHaveClass('flex');
      expect(commonParent).toHaveClass('items-center');
    });
  });
});
