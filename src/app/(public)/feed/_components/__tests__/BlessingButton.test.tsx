import { render, screen, fireEvent } from '@testing-library/react';
import { BlessingButton } from '../BlessingButton';
import { ButtonProps } from '@nextui-org/button';
import { ReactNode } from 'react';

// Mock NextUI Button con tipado correcto
jest.mock('@nextui-org/react', () => ({
  Button: (props: ButtonProps & { children?: ReactNode }) => (
    <button onClick={props.onPress}>{props.children}</button>
  ),
}));

describe('BlessingButton', () => {
  it('llama a onPress cuando el usuario da bless', () => {
    const onPress = jest.fn();
    render(<BlessingButton isBlessed={false} count={0} onPress={onPress} />);
    const blessBtn = screen.getByRole('button');
    fireEvent.click(blessBtn);
    expect(onPress).toHaveBeenCalled();
  });
});
