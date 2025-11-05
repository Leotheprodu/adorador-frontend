import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Error from '../error';

describe('Error Page', () => {
  const mockReset = jest.fn();
  const mockError = { message: 'Test error message', name: 'Error' } as Error;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render error page with title', () => {
    render(<Error error={mockError} reset={mockReset} />);

    expect(screen.getByText('Lo sentimos')).toBeInTheDocument();
    expect(
      screen.getByText('Parece que ha habido un error'),
    ).toBeInTheDocument();
  });

  it('should render retry button', () => {
    render(<Error error={mockError} reset={mockReset} />);

    const button = screen.getByRole('button', { name: /vuelve a intentarlo/i });
    expect(button).toBeInTheDocument();
  });

  it('should call reset when button is clicked', () => {
    render(<Error error={mockError} reset={mockReset} />);

    const button = screen.getByRole('button', { name: /vuelve a intentarlo/i });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should log error on mount', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');

    render(<Error error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
  });

  it('should log error when error prop changes', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const { rerender } = render(<Error error={mockError} reset={mockReset} />);

    const newError = {
      message: 'New error message',
      name: 'Error',
    } as Error;
    rerender(<Error error={newError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(newError);
  });

  it('should have proper styling classes', () => {
    const { container } = render(<Error error={mockError} reset={mockReset} />);

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
});
