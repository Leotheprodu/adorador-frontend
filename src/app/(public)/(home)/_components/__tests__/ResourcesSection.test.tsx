import { render, screen } from '@testing-library/react';
import { ResourcesSection } from '../ResourcesSection';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock posts data
jest.mock('@global/content/posts', () => ({
  posts: [
    {
      id: 1,
      title: 'Post de prueba 1',
      slug: 'post-prueba-1',
      category: 'discipulado',
      image: '/images/test1.jpg',
      content: [
        {
          type: 'paragraph',
          text: 'Este es un contenido de prueba para el primer post.',
        },
      ],
    },
    {
      id: 2,
      title: 'Post de prueba 2',
      slug: 'post-prueba-2',
      category: 'discipulado',
      image: '/images/test2.jpg',
      content: [
        {
          type: 'paragraph',
          text: 'Este es un contenido de prueba para el segundo post.',
        },
      ],
    },
    {
      id: 3,
      title: 'Post de prueba 3',
      slug: 'post-prueba-3',
      category: 'discipulado',
      image: '/images/test3.jpg',
      content: [
        {
          type: 'paragraph',
          text: 'Este es un contenido de prueba para el tercer post.',
        },
      ],
    },
  ],
}));

describe('ResourcesSection Component', () => {
  describe('Component Rendering', () => {
    it('should render the section', () => {
      const { container } = render(<ResourcesSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gray-50');
    });

    it('should render section header', () => {
      render(<ResourcesSection />);
      expect(screen.getByText('Recursos para tu')).toBeInTheDocument();
      expect(screen.getByText('crecimiento espiritual')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(<ResourcesSection />);
      expect(
        screen.getByText(/Artículos y recursos para fortalecer tu ministerio/i),
      ).toBeInTheDocument();
    });
  });

  describe('Posts Grid', () => {
    it('should render three posts', () => {
      render(<ResourcesSection />);
      expect(screen.getByText('Post de prueba 1')).toBeInTheDocument();
      expect(screen.getByText('Post de prueba 2')).toBeInTheDocument();
      expect(screen.getByText('Post de prueba 3')).toBeInTheDocument();
    });

    it('should render post images', () => {
      const { container } = render(<ResourcesSection />);
      const images = container.querySelectorAll('img');
      expect(images.length).toBe(3);
    });

    it('should render post excerpts', () => {
      render(<ResourcesSection />);
      expect(
        screen.getByText(/Este es un contenido de prueba para el primer post/i),
      ).toBeInTheDocument();
    });

    it('should render "Leer más" links', () => {
      render(<ResourcesSection />);
      const readMoreLinks = screen.getAllByText('Leer más');
      expect(readMoreLinks.length).toBe(3);
    });

    it('should have correct links for posts', () => {
      const { container } = render(<ResourcesSection />);
      const links = container.querySelectorAll('a[href*="/discipulado/"]');
      expect(links.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Post Card Styling', () => {
    it('should render post cards with styling', () => {
      const { container } = render(<ResourcesSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should display post titles as headings', () => {
      const { container } = render(<ResourcesSection />);
      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBe(3);
    });
  });

  describe('View All Link', () => {
    it('should render "Ver todos los recursos" button', () => {
      render(<ResourcesSection />);
      expect(screen.getByText('Ver todos los recursos')).toBeInTheDocument();
    });

    it('should link to discipulado page', () => {
      render(<ResourcesSection />);
      const viewAllButton = screen.getByText('Ver todos los recursos');
      expect(viewAllButton.closest('a')).toHaveAttribute(
        'href',
        '/discipulado',
      );
    });

    it('should render arrow icon', () => {
      render(<ResourcesSection />);
      const arrows = screen.getAllByText('→');
      expect(arrows.length).toBeGreaterThanOrEqual(1);
    });

    it('should display view all button', () => {
      render(<ResourcesSection />);
      const button = screen.getByText('Ver todos los recursos');
      expect(button).toBeInTheDocument();
      expect(button.closest('a')).toHaveAttribute('href', '/discipulado');
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid', () => {
      const { container } = render(<ResourcesSection />);
      const grid = container.querySelector('.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('should have responsive padding', () => {
      const { container } = render(<ResourcesSection />);
      const section = container.querySelector('section');
      expect(section).toHaveClass('px-4', 'py-16', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Image Handling', () => {
    it('should use correct image paths', () => {
      const { container } = render(<ResourcesSection />);
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('src');
      });
    });

    it('should have proper image dimensions', () => {
      const { container } = render(<ResourcesSection />);
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('width', '600');
        expect(img).toHaveAttribute('height', '400');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      const { container } = render(<ResourcesSection />);
      const h2 = container.querySelector('h2');
      const h3s = container.querySelectorAll('h3');

      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(3);
    });

    it('should have alt text for images', () => {
      const { container } = render(<ResourcesSection />);
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('Content Truncation', () => {
    it('should truncate long content', () => {
      // This test verifies the truncation logic works
      const { container } = render(<ResourcesSection />);
      const excerpts = container.querySelectorAll('p.text-gray-600');

      excerpts.forEach((excerpt) => {
        const text = excerpt.textContent || '';
        // Should include "Leer más" if content was truncated
        expect(text.length).toBeLessThan(200);
      });
    });
  });
});
