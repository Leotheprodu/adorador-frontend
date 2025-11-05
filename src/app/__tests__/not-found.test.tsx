import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../not-found';

// Mock PageWrapper component
jest.mock('@global/utils/PageWrapper', () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-wrapper">{children}</div>
  ),
}));

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('NotFound Page', () => {
  it('should render 404 heading', () => {
    render(<NotFound />);

    const heading = screen.getByRole('heading', { name: '404' });
    expect(heading).toBeInTheDocument();
  });

  it('should render not found message', () => {
    render(<NotFound />);

    expect(
      screen.getByText('No encontramos el recurso solicitado'),
    ).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(<NotFound />);

    const link = screen.getByRole('link', { name: /volver a inicio/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should be wrapped in PageWrapper', () => {
    const { container } = render(<NotFound />);

    expect(
      container.querySelector('[data-testid="page-wrapper"]'),
    ).toBeInTheDocument();
  });

  it('should have proper styling for container', () => {
    const { container } = render(<NotFound />);

    const mainDiv = container.querySelector('.mt-16');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass(
      'flex',
      'h-60',
      'flex-col',
      'items-center',
      'justify-center',
    );
  });

  it('should have 404 text in uppercase', () => {
    render(<NotFound />);

    const heading = screen.getByRole('heading', { name: '404' });
    expect(heading).toHaveClass('uppercase');
  });

  it('should render link correctly', () => {
    render(<NotFound />);

    const link = screen.getByRole('link', { name: /volver a inicio/i });
    expect(link).toBeInTheDocument();
    expect(link.textContent).toContain('Volver a Inicio');
  });
});
