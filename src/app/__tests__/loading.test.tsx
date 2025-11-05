import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

// Mock Spinner component
jest.mock('@global/utils/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe('Loading Page', () => {
  it('should render Spinner component', () => {
    render(<Loading />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should display loading text', () => {
    render(<Loading />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = render(<Loading />);

    expect(container).toBeInTheDocument();
  });
});
