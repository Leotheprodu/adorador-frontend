import { render, screen } from '@testing-library/react';
import PublicLayout from '../layout';

// Mock child components
jest.mock(
  '@bands/[bandId]/canciones/_components/musicPlayer/MusicPlayer',
  () => ({
    MusicPlayer: () => <div data-testid="music-player">Music Player</div>,
  }),
);

jest.mock('@ui/footer/components/LastFooter', () => ({
  LastFooter: () => <div data-testid="last-footer">Last Footer</div>,
}));

jest.mock('@ui/footer/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('@ui/header/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

describe('PublicLayout', () => {
  describe('Component Structure', () => {
    it('should render the main wrapper with correct class', () => {
      const { container } = render(
        <PublicLayout>
          <div>Test Content</div>
        </PublicLayout>,
      );

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render Header inside header container', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header.parentElement).toHaveClass('h-[5rem]');
    });

    it('should render main element with correct class', () => {
      const { container } = render(
        <PublicLayout>
          <div data-testid="main-content">Main Content</div>
        </PublicLayout>,
      );

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('mb-10');
    });

    it('should render Footer component', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should render MusicPlayer component', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      expect(screen.getByTestId('music-player')).toBeInTheDocument();
    });

    it('should render LastFooter component', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      expect(screen.getByTestId('last-footer')).toBeInTheDocument();
    });
  });

  describe('Component Order', () => {
    it('should render components in correct order', () => {
      const { container } = render(
        <PublicLayout>
          <div data-testid="child-content">Child Content</div>
        </PublicLayout>,
      );

      const wrapper = container.querySelector('.min-h-screen');
      const children = wrapper?.children;

      // Should have 4 children: header wrapper, main, Footer, MusicPlayer, LastFooter
      expect(children).toHaveLength(5);

      // Check order
      expect(children?.[0]).toHaveClass('h-[5rem]'); // Header wrapper
      expect(children?.[1].tagName).toBe('MAIN'); // Main content
      expect(children?.[2]).toHaveTextContent('Footer'); // Footer
      expect(children?.[3]).toHaveTextContent('Music Player'); // MusicPlayer
      expect(children?.[4]).toHaveTextContent('Last Footer'); // LastFooter
    });

    it('should render Header before main content', () => {
      render(
        <PublicLayout>
          <div data-testid="content">Content</div>
        </PublicLayout>,
      );

      const header = screen.getByTestId('header');
      const content = screen.getByTestId('content');

      // Compare positions in DOM
      expect(
        header.compareDocumentPosition(content) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should render Footer after main content', () => {
      render(
        <PublicLayout>
          <div data-testid="content">Content</div>
        </PublicLayout>,
      );

      const content = screen.getByTestId('content');
      const footer = screen.getByTestId('footer');

      expect(
        content.compareDocumentPosition(footer) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should render MusicPlayer after Footer', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const footer = screen.getByTestId('footer');
      const musicPlayer = screen.getByTestId('music-player');

      expect(
        footer.compareDocumentPosition(musicPlayer) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it('should render LastFooter as last component', () => {
      render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const musicPlayer = screen.getByTestId('music-player');
      const lastFooter = screen.getByTestId('last-footer');

      expect(
        musicPlayer.compareDocumentPosition(lastFooter) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });
  });

  describe('Children Rendering', () => {
    it('should render single child inside main', () => {
      render(
        <PublicLayout>
          <div data-testid="single-child">Single Child</div>
        </PublicLayout>,
      );

      const child = screen.getByTestId('single-child');
      const main = child.parentElement;

      expect(child).toBeInTheDocument();
      expect(main?.tagName).toBe('MAIN');
    });

    it('should render multiple children', () => {
      render(
        <PublicLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </PublicLayout>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should handle fragment children', () => {
      render(
        <PublicLayout>
          <>
            <div data-testid="fragment-1">Fragment 1</div>
            <div data-testid="fragment-2">Fragment 2</div>
          </>
        </PublicLayout>,
      );

      expect(screen.getByTestId('fragment-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-2')).toBeInTheDocument();
    });

    it('should handle complex nested children', () => {
      const ComplexChild = () => (
        <div>
          <header data-testid="child-header">Child Header</header>
          <section data-testid="child-section">
            <article>Content</article>
          </section>
        </div>
      );

      render(
        <PublicLayout>
          <ComplexChild />
        </PublicLayout>,
      );

      expect(screen.getByTestId('child-header')).toBeInTheDocument();
      expect(screen.getByTestId('child-section')).toBeInTheDocument();
    });

    it('should handle empty children', () => {
      const { container } = render(<PublicLayout>{null}</PublicLayout>);

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main?.textContent).toBe('');
    });
  });

  describe('CSS Classes', () => {
    it('should apply min-h-screen to wrapper', () => {
      const { container } = render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const wrapper = container.querySelector('.min-h-screen');
      expect(wrapper).toBeInTheDocument();
    });

    it('should apply h-[5rem] to header container', () => {
      const { container } = render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const headerContainer = container.querySelector('.h-\\[5rem\\]');
      expect(headerContainer).toBeInTheDocument();
    });

    it('should apply mb-10 to main element', () => {
      const { container } = render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const main = container.querySelector('main');
      expect(main).toHaveClass('mb-10');
    });
  });

  describe('Integration', () => {
    it('should render all components together correctly', () => {
      render(
        <PublicLayout>
          <div data-testid="page-content">Page Content</div>
        </PublicLayout>,
      );

      // Verify all components are present
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('page-content')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('music-player')).toBeInTheDocument();
      expect(screen.getByTestId('last-footer')).toBeInTheDocument();
    });

    it('should maintain correct layout structure', () => {
      const { container } = render(
        <PublicLayout>
          <div data-testid="content">Content</div>
        </PublicLayout>,
      );

      const wrapper = container.querySelector('.min-h-screen');
      const header = screen.getByTestId('header');
      const content = screen.getByTestId('content');
      const footer = screen.getByTestId('footer');
      const musicPlayer = screen.getByTestId('music-player');
      const lastFooter = screen.getByTestId('last-footer');

      // All should be descendants of wrapper
      expect(wrapper).toContainElement(header);
      expect(wrapper).toContainElement(content);
      expect(wrapper).toContainElement(footer);
      expect(wrapper).toContainElement(musicPlayer);
      expect(wrapper).toContainElement(lastFooter);
    });
  });

  describe('Accessibility', () => {
    it('should have a main landmark', () => {
      const { container } = render(
        <PublicLayout>
          <div>Content</div>
        </PublicLayout>,
      );

      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render children inside main for proper semantics', () => {
      render(
        <PublicLayout>
          <h1 data-testid="page-title">Page Title</h1>
          <p>Page content</p>
        </PublicLayout>,
      );

      const title = screen.getByTestId('page-title');
      const main = title.closest('main');

      expect(main).toBeInTheDocument();
    });
  });
});
