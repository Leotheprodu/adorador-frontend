// Mock explícito de ShareSongCommentModal para evitar error de componente undefined
jest.mock('../ShareSongCommentModal', () => ({
  ShareSongCommentModal: () => <div data-testid="ShareSongCommentModal" />,
}));
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock NextUI components con tipado correcto
jest.mock('@nextui-org/react', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    __esModule: true,
    Card: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="Card">{children}</div>
    ),
    CardBody: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="CardBody">{children}</div>
    ),
    Avatar: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="Avatar">{children}</div>
    ),
    Button: ({
      children,
      onPress,
      ...props
    }: React.PropsWithChildren<
      { onPress?: () => void } & Record<string, unknown>
    >) => (
      <button onClick={onPress} {...props}>
        {children}
      </button>
    ),
    Textarea: ({
      value,
      onValueChange,
      ...props
    }: { value?: string; onValueChange?: (v: string) => void } & Record<
      string,
      unknown
    >) => (
      <textarea
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        {...props}
      />
    ),
    Spinner: () => <div data-testid="Spinner">Loading...</div>,
    Chip: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="Chip">{children}</div>
    ),
    Tooltip: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="Tooltip">{children}</div>
    ),
  };
});

// Mock nanostores si se usan (por consistencia)
jest.mock('nanostores', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  atom: (init: any) => ({ get: () => init, set: () => {} }),
  map: () => ({}),
  computed: () => ({}),
}));

import { CommentSection } from '../CommentSection';

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('CommentSection - Moderación', () => {
  it('no permite enviar comentarios con palabras prohibidas', () => {
    const onSubmitComment = jest.fn();
    renderWithQueryClient(
      <CommentSection
        comments={[]}
        onSubmitComment={onSubmitComment}
        isLoadingComments={false}
      />,
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Esto es una maldición' } });
    const sendBtn = screen.getByRole('button');
    fireEvent.click(sendBtn);
    // Simulamos que la función de moderación previene el envío
    expect(onSubmitComment).not.toHaveBeenCalled();
  });
});
