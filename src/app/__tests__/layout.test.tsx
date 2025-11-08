import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '../layout';
import { appName, appDescription, domain } from '@global/config/constants';

// Mock the Providers component
jest.mock('@global/utils/Providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

describe('RootLayout', () => {
  describe('Component rendering', () => {
    it('should render the html element with correct lang and class', () => {
      const { container } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      const htmlElement = container.querySelector('html');
      expect(htmlElement).toHaveAttribute('lang', 'es');
      expect(htmlElement).toHaveClass('bg-blanco');
    });

    it('should render the body element with correct class', () => {
      const { container } = render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      const bodyElement = container.querySelector('body');
      expect(bodyElement).toHaveClass('bg-blanco');
    });

    it('should render the Providers wrapper', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId('providers')).toBeInTheDocument();
    });

    it('should render the Toaster component', () => {
      render(
        <RootLayout>
          <div>Test Content</div>
        </RootLayout>,
      );

      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('should render children inside Providers', () => {
      render(
        <RootLayout>
          <div data-testid="child-content">Child Component</div>
        </RootLayout>,
      );

      const childContent = screen.getByTestId('child-content');
      expect(childContent).toBeInTheDocument();
      expect(childContent).toHaveTextContent('Child Component');
    });

    it('should render multiple children', () => {
      render(
        <RootLayout>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <div data-testid="child-3">Third Child</div>
        </RootLayout>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should have correct DOM structure', () => {
      const { container } = render(
        <RootLayout>
          <div>Test</div>
        </RootLayout>,
      );

      const html = container.querySelector('html');
      const body = html?.querySelector('body');
      const providers = body?.querySelector('[data-testid="providers"]');
      const toaster = body?.querySelector('[data-testid="toaster"]');

      expect(html).toBeInTheDocument();
      expect(body).toBeInTheDocument();
      expect(providers).toBeInTheDocument();
      expect(toaster).toBeInTheDocument();
    });
  });

  describe('Metadata configuration', () => {
    it('should have correct title configuration', () => {
      expect(metadata.title).toEqual({
        template: `%s | ${appName}`,
        default: `${appName}`,
      });
    });

    it('should have correct description', () => {
      expect(metadata.description).toBe(appDescription);
    });

    it('should have favicon icon', () => {
      expect(metadata.icons).toEqual({
        icon: '/favicon.ico',
      });
    });

    it('should have correct keywords', () => {
      expect(metadata.keywords).toEqual([
        'iglesia',
        'herramientas',
        'cristiano',
      ]);
    });

    describe('OpenGraph metadata', () => {
      it('should have correct OpenGraph configuration', () => {
        expect(metadata.openGraph).toBeDefined();
        expect(metadata.openGraph?.title).toBe(appName);
        expect(metadata.openGraph?.description).toBe(appDescription);
        expect(metadata.openGraph?.url).toBe(domain);
        expect(metadata.openGraph?.siteName).toBe(appName);
        expect(metadata.openGraph?.locale).toBe('es_CR');
      });

      it('should have correct OpenGraph images', () => {
        expect(metadata.openGraph?.images).toHaveLength(1);
        expect(metadata.openGraph?.images?.[0]).toEqual({
          url: '/images/adoradorxyz.webp',
          width: 1200,
          height: 628,
          alt: 'Plataforma profesional para equipos de alabanza y liderazgo cristiano.',
        });
      });
    });

    describe('Robots metadata', () => {
      it('should have correct robots configuration', () => {
        expect(metadata.robots).toBeDefined();

        if (typeof metadata.robots !== 'string') {
          expect(metadata.robots?.index).toBe(true);
          expect(metadata.robots?.follow).toBe(true);
          expect(metadata.robots?.nocache).toBe(true);
          expect(metadata.robots?.googleBot).toBeDefined();

          const googleBot = metadata.robots?.googleBot;
          if (googleBot && typeof googleBot !== 'string') {
            expect(googleBot.index).toBe(true);
            expect(googleBot.follow).toBe(true);
          }
        }
      });

      it('should allow indexing and following', () => {
        if (typeof metadata.robots !== 'string') {
          expect(metadata.robots?.index).toBe(true);
          expect(metadata.robots?.follow).toBe(true);
        }
      });

      it('should have nocache enabled', () => {
        if (typeof metadata.robots !== 'string') {
          expect(metadata.robots?.nocache).toBe(true);
        }
      });

      it('should have GoogleBot configuration', () => {
        if (typeof metadata.robots !== 'string') {
          const googleBot = metadata.robots?.googleBot;
          if (googleBot && typeof googleBot !== 'string') {
            expect(googleBot).toBeDefined();
            expect(googleBot.index).toBe(true);
            expect(googleBot.follow).toBe(true);
          }
        }
      });
    });

    it('should not have Twitter metadata configured', () => {
      expect(metadata.twitter).toBeUndefined();
    });
  });

  describe('Layout props', () => {
    it('should accept and render React nodes as children', () => {
      const complexChild = (
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
          <button>Button</button>
        </div>
      );

      const { container } = render(<RootLayout>{complexChild}</RootLayout>);

      expect(container.querySelector('h1')).toHaveTextContent('Title');
      expect(container.querySelector('p')).toHaveTextContent('Paragraph');
      expect(container.querySelector('button')).toHaveTextContent('Button');
    });

    it('should handle empty children', () => {
      const { container } = render(<RootLayout>{null}</RootLayout>);

      expect(container.querySelector('html')).toBeInTheDocument();
      expect(container.querySelector('body')).toBeInTheDocument();
    });

    it('should handle fragment children', () => {
      render(
        <RootLayout>
          <>
            <div data-testid="fragment-child-1">Child 1</div>
            <div data-testid="fragment-child-2">Child 2</div>
          </>
        </RootLayout>,
      );

      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should integrate Toaster and Providers correctly', () => {
      render(
        <RootLayout>
          <div data-testid="app-content">App Content</div>
        </RootLayout>,
      );

      const providers = screen.getByTestId('providers');
      const toaster = screen.getByTestId('toaster');
      const content = screen.getByTestId('app-content');

      // All elements should be in the document
      expect(providers).toBeInTheDocument();
      expect(toaster).toBeInTheDocument();
      expect(content).toBeInTheDocument();

      // Content should be inside providers
      expect(providers).toContainElement(content);
    });
  });

  describe('CSS classes', () => {
    it('should apply bg-blanco class to both html and body', () => {
      const { container } = render(
        <RootLayout>
          <div>Content</div>
        </RootLayout>,
      );

      const html = container.querySelector('html');
      const body = container.querySelector('body');

      expect(html).toHaveClass('bg-blanco');
      expect(body).toHaveClass('bg-blanco');
    });
  });
});
