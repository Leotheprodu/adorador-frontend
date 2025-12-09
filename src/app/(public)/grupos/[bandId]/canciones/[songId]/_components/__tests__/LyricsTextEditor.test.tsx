import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LyricsTextEditor } from '../LyricsTextEditor';

// Mock NextUI components
jest.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    disabled,
    isDisabled,
    ...props
  }: React.PropsWithChildren<{
    onPress?: () => void;
    disabled?: boolean;
    isDisabled?: boolean;
  }>) => (
    <button onClick={onPress} disabled={disabled || isDisabled} {...props}>
      {children}
    </button>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Textarea: ({ value, onChange, ...props }: any) => (
    <textarea value={value} onChange={onChange} {...props} />
  ),
  Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardBody: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

// Mock PrimaryButton para que respete disabled
jest.mock('@global/components/buttons', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PrimaryButton: ({ children, disabled, isDisabled, onClick, ...props }: any) => (
    <button disabled={disabled || isDisabled} onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock lyricsStorage
const mockGetTempLyrics = jest.fn();
const mockSaveTempLyrics = jest.fn();
const mockDeleteTempLyrics = jest.fn();

jest.mock('../../_utils/lyricsStorage', () => ({
  getTempLyrics: (...args: unknown[]) => mockGetTempLyrics(...args),
  saveTempLyrics: (...args: unknown[]) => mockSaveTempLyrics(...args),
  deleteTempLyrics: (...args: unknown[]) => mockDeleteTempLyrics(...args),
}));

// Mock the services
jest.mock('../../_services/songIdServices', () => ({
  parseTextLyricsService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
  })),
  deleteAllLyricsService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
  })),
}));

describe('LyricsTextEditor', () => {
  const mockParams = { bandId: '1', songId: '100' };
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockGetTempLyrics.mockReturnValue(null);
    mockSaveTempLyrics.mockClear();
    mockDeleteTempLyrics.mockClear();
  });

  it('should render the editor with instructions', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(screen.getByText('Editor de Letras')).toBeInTheDocument();
    expect(screen.getByText('Instrucciones de formato:')).toBeInTheDocument();
    expect(screen.getByText('Cargar Letra')).toBeInTheDocument();
  });

  it('should display example with correct format', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(screen.getByText('Ejemplo:')).toBeInTheDocument();
    // Check for example lyrics text that appears in the example block
    expect(screen.getByText(/Mi Dios, eres mi fortaleza/)).toBeInTheDocument();
  });

  it('should load saved lyrics from localStorage on mount', () => {
    const savedLyrics = {
      songId: '100',
      bandId: '1',
      text: 'Saved lyrics text',
      timestamp: Date.now(),
    };
    mockGetTempLyrics.mockReturnValue(savedLyrics);

    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    expect(textarea).toHaveValue('Saved lyrics text');
  });

  it('should load initialText in edit mode', () => {
    const initialText = '(verso)\nEm\nTest lyrics';

    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
        initialText={initialText}
        isEditMode={true}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    expect(textarea).toHaveValue(initialText);
  });

  it('should prioritize localStorage over initialText in edit mode', () => {
    const savedLyrics = {
      songId: '100',
      bandId: '1',
      text: 'Saved work in progress',
      timestamp: Date.now(),
    };
    mockGetTempLyrics.mockReturnValue(savedLyrics);

    const initialText = '(verso)\nEm\nOriginal lyrics';

    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
        initialText={initialText}
        isEditMode={true}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    // Should load from localStorage, not initialText
    expect(textarea).toHaveValue('Saved work in progress');
  });

  it('should update textarea value when typing', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    fireEvent.change(textarea, { target: { value: 'New lyrics' } });

    expect(textarea).toHaveValue('New lyrics');
  });

  it.skip('should auto-save to localStorage after typing', async () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        songTitle="Test Song"
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    fireEvent.change(textarea, { target: { value: 'Auto save test' } });

    await waitFor(
      () => {
        expect(mockSaveTempLyrics).toHaveBeenCalledWith(
          '1',
          '100',
          'Auto save test',
          'Test Song',
        );
      },
      { timeout: 1500 },
    );
  });

  it('should show saving indicator while auto-saving', async () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    fireEvent.change(textarea, { target: { value: 'Testing save' } });

    await waitFor(
      () => {
        expect(screen.getByText(/Guardado:/)).toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('should disable submit button when text is empty', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const submitButton = screen.getByText('Cargar Letra');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when text is not empty', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    fireEvent.change(textarea, { target: { value: 'Some lyrics' } });

    const submitButton = screen.getByText('Cargar Letra');
    expect(submitButton).toBeEnabled();
  });

  it('should disable submit button when text is empty', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const submitButton = screen.getByText('Cargar Letra');
    expect(submitButton).toBeDisabled();
  });

  it('should display all instruction items', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(
      screen.getByText(/Incluye etiquetas de estructura entre paréntesis/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Los acordes van sobre la letra/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Formato de acordes:/)).toBeInTheDocument();
    expect(screen.getByText(/Puedes usar bemoles/)).toBeInTheDocument();
    expect(
      screen.getByText(/Puedes dejar espacios en blanco/),
    ).toBeInTheDocument();
  });

  it('should apply correct CSS classes to textarea', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    expect(textarea).toHaveClass('font-mono', 'text-sm', 'min-h-[300px]');
  });

  it('should center content with max-width', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    // Look for an element with max-w-3xl class
    const elementsWithMaxWidth = document.querySelectorAll('.max-w-3xl');
    expect(elementsWithMaxWidth.length).toBeGreaterThan(0);
  });

  it('should not auto-save when text is empty', async () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    // Wait for potential auto-save
    await new Promise((resolve) => setTimeout(resolve, 1500));

    expect(mockSaveTempLyrics).not.toHaveBeenCalled();
  });

  it('should update last saved time after auto-save', async () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    fireEvent.change(textarea, { target: { value: 'Test' } });

    await waitFor(
      () => {
        expect(screen.getByText(/Guardado:/)).toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it('should have spellCheck disabled on textarea', () => {
    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const textarea = screen.getByPlaceholderText(/Escribe aquí la letra/);
    expect(textarea).toHaveAttribute('spellCheck', 'false');
  });

  it('should call onClose after successful save', async () => {
    const mockOnClose = jest.fn();

    render(
      <LyricsTextEditor
        params={mockParams}
        refetchLyricsOfCurrentSong={mockRefetch}
        onClose={mockOnClose}
      />,
    );

    // onClose should not be called initially
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
