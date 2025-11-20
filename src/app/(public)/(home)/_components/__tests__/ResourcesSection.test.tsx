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
  // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
  return (props: any) => {
    const { children, href, ...rest } = props;
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

// Mock Button de NextUI para simular correctamente el árbol de botones con as=Link
jest.mock('@nextui-org/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ as, href, children, ...props }: any) => {
    if (as && href) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return <button {...props}>{children}</button>;
  },
}));

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
    it('should render the section with dark mode classes', () => {
      const { container } = render(<ResourcesSection />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass('bg-gray-50');
      expect(section?.className).toMatch(/dark:bg-gray-950/);
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

    it('should render clickable post cards as links', () => {
      const { container } = render(<ResourcesSection />);
      const postLinks = container.querySelectorAll('a[href*="/discipulado/"]');
      // Should have 3 post links + 1 "Ver todos" button link = 4 total
      expect(postLinks.length).toBeGreaterThanOrEqual(3);
    });

    it('should have correct links for posts', () => {
      const { container } = render(<ResourcesSection />);
      const links = container.querySelectorAll('a[href*="/discipulado/"]');
      expect(links.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Post Card Styling', () => {
    it('debe renderizar exactamente 3 cards de post con los estilos correctos', () => {
      const { container } = render(<ResourcesSection />);
      // Buscar los <a> de los posts por href
      const cards = container.querySelectorAll(
        'a[href^="/discipulado/post-prueba-"]',
      );
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card.className).toMatch(/bg-white/);
        expect(card.className).toMatch(/dark:bg-brand-purple-900/);
        expect(card.className).toMatch(/dark:ring-brand-purple-800/);
      });
    });

    it('should render post cards with dark mode classes', () => {
      const { container } = render(<ResourcesSection />);
      // Cards deben tener bg-white y dark:bg-brand-purple-900
      const cards = container.querySelectorAll('.rounded-2xl');
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card.className).toMatch(/bg-white/);
        expect(card.className).toMatch(/dark:bg-brand-purple-900/);
        expect(card.className).toMatch(/dark:ring-brand-purple-800/);
        expect(card.className).not.toMatch(/gradient/);
      });
    });

    it('should render the button with correct backgrounds in both modes', () => {
      render(<ResourcesSection />);
      // Buscar el botón por su texto
      const button = screen.getByText('Ver todos los recursos').closest('a');
      expect(button).toBeInTheDocument();
      expect(button?.className).toMatch(/dark:bg-brand-purple-900/);
      expect(button?.className).toMatch(/dark:text-brand-purple-200/);
      expect(button?.className).not.toMatch(/gradient/);
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
        expect(img).toHaveAttribute('width', '400');
        expect(img).toHaveAttribute('height', '192');
      });
    });
  });

  describe('Accessibility', () => {
    it('debe tener jerarquía de headings correcta', () => {
      const { container } = render(<ResourcesSection />);
      const h2 = container.querySelector('h2');
      const h3s = container.querySelectorAll('h3');
      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(3);
    });

    it('debe tener alt text en todas las imágenes', () => {
      const { container } = render(<ResourcesSection />);
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('debe truncar el contenido largo en los excerpts', () => {
      const { container } = render(<ResourcesSection />);
      const excerpts = container.querySelectorAll('p.text-gray-600');
      excerpts.forEach((excerpt) => {
        const text = excerpt.textContent || '';
        expect(text.length).toBeLessThan(200);
      });
    });
  });
});
