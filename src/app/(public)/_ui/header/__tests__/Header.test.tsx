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

    it('should have shadow styling', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('shadow-lg');
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
      expect(logo).toHaveAttribute('src', '/logo_adorador.avif');
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
      expect(logo).toHaveClass('h-10');
      expect(logo).toHaveClass('w-auto');
      expect(logo).toHaveClass('object-contain');
    });

    it('should render app name as h1', () => {
      render(<Header />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test App Name');
    });

    it('should apply correct typography classes to app name', () => {
      render(<Header />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('font-agdasima');
      expect(heading).toHaveClass('text-3xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('uppercase');
      expect(heading).toHaveClass('text-gradient-primary');
      expect(heading).toHaveClass('transition-all');
    });
  });

  describe('Home Link', () => {
    it('should render link to home page', () => {
      render(<Header />);

      const homeLink = screen.getByRole('link');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should wrap logo and app name in home link', () => {
      render(<Header />);

      const homeLink = screen.getByRole('link');
      const logo = screen.getByAltText('Test App Name');
      const heading = screen.getByRole('heading', { level: 1 });

      expect(homeLink).toContainElement(logo);
      expect(homeLink).toContainElement(heading);
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

    it('should render ResponsiveNavBar after logo/brand section', () => {
      render(<Header />);

      const heading = screen.getByRole('heading', { level: 1 });
      const navbar = screen.getByTestId('responsive-navbar');

      expect(
        heading.compareDocumentPosition(navbar) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });

  describe('Semantic HTML', () => {
    it('should use header tag as wrapper', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
    });

    it('should have proper heading hierarchy with h1', () => {
      render(<Header />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
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

    it('should have heading for screen readers', () => {
      render(<Header />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
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
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
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

    it('should have responsive background opacity', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-white/80');
    });

    it('should have responsive backdrop blur', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('backdrop-blur-md');
    });
  });

  describe('Mobile Component Visibility Integration', () => {
    it('should render both NotificationBell and ResponsiveNavBar', () => {
      render(<Header />);

      expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-navbar')).toBeInTheDocument();
    });

    it('should place both components in the same container with gap', () => {
      render(<Header />);

      const notificationBell = screen.getByTestId('notification-bell');
      const navbar = screen.getByTestId('responsive-navbar');

      // Ambos deben estar en el mismo contenedor padre
      const commonParent = notificationBell.parentElement;
      expect(commonParent).toContain(navbar);

      // El contenedor debe tener gap-3 para separarlos
      expect(commonParent).toHaveClass('gap-3');
      expect(commonParent).toHaveClass('flex');
      expect(commonParent).toHaveClass('items-center');
    });
  });
});
