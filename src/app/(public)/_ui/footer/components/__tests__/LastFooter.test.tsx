import { render, screen } from '@testing-library/react';
import { LastFooter } from '../LastFooter';

// Mock constants
jest.mock('@global/config/constants', () => ({
  appName: 'Test App',
}));

describe('LastFooter Component', () => {
  const currentYear = new Date().getFullYear();

  describe('Structure and Layout', () => {
    it('should render section element', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should apply correct section classes', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('flex');
      expect(section).toHaveClass('items-center');
      expect(section).toHaveClass('justify-center');
      expect(section).toHaveClass('bg-slate-900');
      expect(section).toHaveClass('p-2');
      expect(section).toHaveClass('text-center');
      expect(section).toHaveClass('text-xs');
      expect(section).toHaveClass('text-slate-400');
    });

    it('should contain a paragraph', () => {
      const { container } = render(<LastFooter />);

      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should display current year', () => {
      render(<LastFooter />);

      expect(
        screen.getByText(currentYear.toString(), { exact: false }),
      ).toBeInTheDocument();
    });

    it('should display copyright symbol', () => {
      render(<LastFooter />);

      expect(screen.getByText(/©/)).toBeInTheDocument();
    });

    it('should display app name', () => {
      render(<LastFooter />);

      expect(screen.getByText('Test App')).toBeInTheDocument();
    });

    it('should apply correct styling to app name', () => {
      render(<LastFooter />);

      const appName = screen.getByText('Test App');
      expect(appName).toHaveClass('font-agdasima');
      expect(appName).toHaveClass('font-bold');
      expect(appName).toHaveClass('uppercase');
    });

    it('should display "Hecho por" text', () => {
      render(<LastFooter />);

      expect(screen.getByText(/hecho por/i)).toBeInTheDocument();
    });

    it('should display heart emoji', () => {
      render(<LastFooter />);

      expect(screen.getByText(/❤️/)).toBeInTheDocument();
    });

    it('should display "para la comunidad cristiana" text', () => {
      render(<LastFooter />);

      expect(
        screen.getByText(/para la comunidad cristiana/i),
      ).toBeInTheDocument();
    });
  });

  describe('Developer Link', () => {
    it('should render link to developer website', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toBeInTheDocument();
    });

    it('should have correct href', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toHaveAttribute(
        'href',
        'https://leoserranodev.vercel.app/es/',
      );
    });

    it('should open in new tab', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('should have security attributes', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should apply correct styling to link', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toHaveClass('border-slate-400');
      expect(link).toHaveClass('transition-all');
      expect(link).toHaveClass('duration-200');
      expect(link).toHaveClass('hover:border-b-1');
      expect(link).toHaveClass('hover:text-slate-100');
    });
  });

  describe('Separators', () => {
    it('should have separator between app name and author', () => {
      render(<LastFooter />);

      const separators = screen.getAllByText('|');
      expect(separators).toHaveLength(1);
    });

    it('should apply correct styling to separator', () => {
      render(<LastFooter />);

      const separator = screen.getByText('|');
      expect(separator).toHaveClass('mx-1');
    });
  });

  describe('Semantic HTML', () => {
    it('should use section tag', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('should use paragraph tag for content', () => {
      const { container } = render(<LastFooter />);

      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();
    });

    it('should use anchor tag for external link', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link');
      expect(link.tagName).toBe('A');
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive link text', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link', { name: /leonardo serrano/i });
      expect(link).toHaveTextContent('Leonardo Serrano');
    });

    it('should have rel attribute for security', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should be keyboard accessible', () => {
      render(<LastFooter />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href');
    });
  });

  describe('Text Content', () => {
    it('should contain full copyright text', () => {
      const { container } = render(<LastFooter />);

      const paragraph = container.querySelector('p');
      expect(paragraph?.textContent).toContain('©');
      expect(paragraph?.textContent).toContain(currentYear.toString());
      expect(paragraph?.textContent).toContain('Test App');
      expect(paragraph?.textContent).toContain('Hecho por');
      expect(paragraph?.textContent).toContain('Leonardo Serrano');
      expect(paragraph?.textContent).toContain('❤️');
      expect(paragraph?.textContent).toContain('para la comunidad cristiana');
    });

    it('should have correct text order', () => {
      const { container } = render(<LastFooter />);

      const paragraph = container.querySelector('p');
      const text = paragraph?.textContent || '';

      // Check order
      const copyrightIndex = text.indexOf('©');
      const yearIndex = text.indexOf(currentYear.toString());
      const appNameIndex = text.indexOf('Test App');
      const authorIndex = text.indexOf('Leonardo Serrano');

      expect(copyrightIndex).toBeLessThan(yearIndex);
      expect(yearIndex).toBeLessThan(appNameIndex);
      expect(appNameIndex).toBeLessThan(authorIndex);
    });
  });

  describe('Styling', () => {
    it('should have dark background', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-slate-900');
    });

    it('should have light text color', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-slate-400');
    });

    it('should have small text size', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-xs');
    });

    it('should center content', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('text-center');
      expect(section).toHaveClass('items-center');
      expect(section).toHaveClass('justify-center');
    });

    it('should have padding', () => {
      const { container } = render(<LastFooter />);

      const section = container.querySelector('section');
      expect(section).toHaveClass('p-2');
    });
  });

  describe('Dynamic Content', () => {
    it('should update year dynamically', () => {
      const { rerender } = render(<LastFooter />);

      expect(
        screen.getByText(currentYear.toString(), { exact: false }),
      ).toBeInTheDocument();

      // The year is calculated on each render
      rerender(<LastFooter />);

      expect(
        screen.getByText(currentYear.toString(), { exact: false }),
      ).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should render all elements correctly together', () => {
      render(<LastFooter />);

      // Check all main elements are present
      expect(screen.getByText(/©/)).toBeInTheDocument();
      expect(
        screen.getByText(currentYear.toString(), { exact: false }),
      ).toBeInTheDocument();
      expect(screen.getByText('Test App')).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /leonardo serrano/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/❤️/)).toBeInTheDocument();
    });
  });
});
