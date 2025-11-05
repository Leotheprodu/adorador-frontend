import { render } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner Component', () => {
  it('should render spinner container', () => {
    const { container } = render(<Spinner />);
    const spinnerGrid = container.querySelector('.sk-cube-grid');
    expect(spinnerGrid).toBeInTheDocument();
  });

  it('should render all 9 cubes', () => {
    const { container } = render(<Spinner />);
    const cubes = container.querySelectorAll('.sk-cube');
    expect(cubes).toHaveLength(9);
  });

  it('should have fixed positioning', () => {
    const { container } = render(<Spinner />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('fixed');
    expect(wrapper).toHaveClass('inset-0');
  });
});
