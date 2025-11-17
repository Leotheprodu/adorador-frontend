import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

// Mock child components
jest.mock('@ui/footer/components/PaypalDonationButton', () => ({
  PaypalDonationButton: () => (
    <button data-testid="paypal-donation">PayPal Donation</button>
  ),
}));

jest.mock('@ui/footer/components/MoreDonationButton', () => ({
  MoreDonationButton: () => (
    <button data-testid="more-donation">More Donation</button>
  ),
}));

jest.mock('@ui/footer/components/svg/WaveFooterSVG', () => ({
  WaveFooterSVG: ({ className }: { className: string }) => (
    <svg data-testid="wave-footer-svg" className={className}>
      Wave SVG
    </svg>
  ),
}));

jest.mock('@ui/footer/components/ScrollToTopButton', () => ({
  __esModule: true,
  default: () => <button data-testid="scroll-to-top">Scroll to Top</button>,
}));

jest.mock('../../header/components/NavbarLinks', () => ({
  NavbarLinks: ({ backgroundColor }: { backgroundColor: string }) => (
    <div data-testid="navbar-links" data-background={backgroundColor}>
      Navbar Links
    </div>
  ),
}));

jest.mock('@global/config/links', () => ({
  links: [
    { href: '/link1', label: 'Link 1' },
    { href: '/link2', label: 'Link 2' },
  ],
}));

describe('Footer Component', () => {
  describe('Structure and Layout', () => {
    it('should render footer element', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should apply correct footer classes', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('mt-40');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('h-full');
      expect(footer).toHaveClass('flex-col');
      expect(footer).toHaveClass('relative');
      expect(footer).toHaveClass('overflow-hidden');
    });

    it('should render section with grid layout', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('relative');
      expect(section).toHaveClass('grid');
    });

    it('should have responsive grid columns', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('grid-cols-[1fr]');
      expect(section).toHaveClass('md:grid-cols-[1fr_1fr_1fr_1fr]');
    });
  });

  describe('ScrollToTopButton', () => {
    it('should render ScrollToTopButton', () => {
      render(<Footer />);

      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    });
  });

  describe('WaveFooterSVG', () => {
    it('should render WaveFooterSVG', () => {
      render(<Footer />);

      expect(screen.getByTestId('wave-footer-svg')).toBeInTheDocument();
    });

    it('should apply correct positioning classes to wave', () => {
      render(<Footer />);

      const wave = screen.getByTestId('wave-footer-svg');
      expect(wave).toHaveClass('absolute');
      expect(wave).toHaveClass('bottom-[98%]');
      expect(wave).toHaveClass('-z-10');
      expect(wave).toHaveClass('w-full');
      expect(wave).toHaveClass('text-gray-900');
    });
  });

  describe('Navigation Links Section', () => {
    it('should render navigation links section', () => {
      const { container } = render(<Footer />);

      const linksSection = container.querySelector('ul');
      expect(linksSection).toBeInTheDocument();
    });

    it('should hide navigation links on mobile', () => {
      const { container } = render(<Footer />);

      const linksSection = container.querySelector('ul');
      expect(linksSection).toHaveClass('hidden');
      expect(linksSection).toHaveClass('md:flex');
    });

    it('should render "Enlaces" heading', () => {
      render(<Footer />);

      const heading = screen.getByRole('heading', { name: /enlaces/i });
      expect(heading).toBeInTheDocument();
    });

    it('should apply correct styles to enlaces heading', () => {
      render(<Footer />);

      const heading = screen.getByRole('heading', { name: /enlaces/i });
      expect(heading).toHaveClass('text-gradient-simple');
      expect(heading).toHaveClass('mb-4');
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('uppercase');
    });

    it('should render NavbarLinks with correct background', () => {
      render(<Footer />);

      const navbarLinks = screen.getByTestId('navbar-links');
      expect(navbarLinks).toBeInTheDocument();
      expect(navbarLinks).toHaveAttribute('data-background', 'dark');
    });
  });

  describe('Bible Verse Section', () => {
    it('should render bible verse section', () => {
      const { container } = render(<Footer />);

      const verseSection = container.querySelector(
        '.md\\:col-span-2.md\\:col-start-2',
      );
      expect(verseSection).toBeInTheDocument();
    });

    it('should render bible verse reference', () => {
      render(<Footer />);

      const reference = screen.getByText(/salmos 95:1-2/i);
      expect(reference).toBeInTheDocument();
      expect(reference).toHaveClass('font-bold');
    });

    it('should render bible verse text', () => {
      render(<Footer />);

      const verseText = screen.getByText(/venid, aclamemos alegremente/i);
      expect(verseText).toBeInTheDocument();
    });

    it('should apply correct styles to verse section', () => {
      const { container } = render(<Footer />);

      const verseSection = container.querySelector(
        '.md\\:col-span-2.md\\:col-start-2',
      );
      expect(verseSection).toHaveClass('text-base');
      expect(verseSection).toHaveClass('text-gray-300');
      expect(verseSection).toHaveClass('md:border-x-1');
    });
  });

  describe('Donations Section', () => {
    it('should render donations section', () => {
      const { container } = render(<Footer />);

      const donationsSection = container.querySelector('.md\\:col-start-4');
      expect(donationsSection).toBeInTheDocument();
    });

    it('should render "Donaciones" heading', () => {
      render(<Footer />);

      const heading = screen.getByRole('heading', { name: /donaciones/i });
      expect(heading).toBeInTheDocument();
    });

    it('should apply correct styles to donaciones heading', () => {
      render(<Footer />);

      const heading = screen.getByRole('heading', { name: /donaciones/i });
      expect(heading).toHaveClass('text-gradient-simple');
      expect(heading).toHaveClass('mb-4');
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('uppercase');
    });

    it('should render PaypalDonationButton', () => {
      render(<Footer />);

      expect(screen.getByTestId('paypal-donation')).toBeInTheDocument();
    });

    it('should render MoreDonationButton', () => {
      render(<Footer />);

      expect(screen.getByTestId('more-donation')).toBeInTheDocument();
    });

    it('should layout donation buttons vertically', () => {
      const { container } = render(<Footer />);

      const donationsSection = container.querySelector('.md\\:col-start-4');
      expect(donationsSection).toHaveClass('flex-col');
      expect(donationsSection).toHaveClass('gap-5');
      expect(donationsSection).toHaveClass('p-4');
    });
  });

  describe('Semantic HTML', () => {
    it('should use footer tag as wrapper', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should use section tag for main content', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should use h2 headings for sections', () => {
      render(<Footer />);

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2); // Enlaces and Donaciones
    });
  });

  describe('Responsive Design', () => {
    it('should have mobile-first grid layout', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('grid-cols-[1fr]');
    });

    it('should have desktop grid layout', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('md:grid-cols-[1fr_1fr_1fr_1fr]');
    });

    it('should hide navigation links on mobile', () => {
      const { container } = render(<Footer />);

      const linksSection = container.querySelector('ul');
      expect(linksSection).toHaveClass('hidden');
      expect(linksSection).toHaveClass('md:flex');
    });

    it('should span columns correctly on desktop', () => {
      const { container } = render(<Footer />);

      const verseSection = container.querySelector('.md\\:col-span-2');
      expect(verseSection).toHaveClass('md:col-start-2');

      const donationsSection = container.querySelector('.md\\:col-start-4');
      expect(donationsSection).toHaveClass('md:col-span-1');
    });
  });

  describe('Color Scheme', () => {
    it('should use gradient background with brand colors', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      expect(footer).toHaveClass('bg-gradient-to-br');
      expect(footer).toHaveClass('from-gray-900');
      expect(footer).toHaveClass('via-brand-purple-950');
      expect(footer).toHaveClass('to-gray-900');
    });

    it('should use light text colors', () => {
      const { container } = render(<Footer />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-white');
    });

    it('should have decorative glow elements', () => {
      const { container } = render(<Footer />);

      const glowElements = container.querySelectorAll('.blur-3xl');
      expect(glowElements.length).toBeGreaterThan(0);
    });
  });

  describe('Integration', () => {
    it('should render all main sections together', () => {
      render(<Footer />);

      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
      expect(screen.getByTestId('wave-footer-svg')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-links')).toBeInTheDocument();
      expect(screen.getByText(/salmos 95:1-2/i)).toBeInTheDocument();
      expect(screen.getByTestId('paypal-donation')).toBeInTheDocument();
      expect(screen.getByTestId('more-donation')).toBeInTheDocument();
    });

    it('should have correct component hierarchy', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      const section = container.querySelector('section');

      expect(footer).toContainElement(section!);
      expect(section).toContainElement(screen.getByTestId('scroll-to-top'));
      expect(section).toContainElement(screen.getByTestId('wave-footer-svg'));
      expect(section).toContainElement(
        screen.getByRole('heading', { name: /enlaces/i }),
      );
      expect(section).toContainElement(
        screen.getByRole('heading', { name: /donaciones/i }),
      );
    });
  });
});
