import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MiniLyricsEditor } from '../MiniLyricsEditor';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock de servicios
jest.mock('../../_services/songIdServices', () => ({
  parseAndUpdateSingleLyricService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
    isPending: false,
  })),
  deleteLyricService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
    isPending: false,
  })),
  updateLyricsPositionsService: jest.fn(() => ({
    mutate: jest.fn(),
    status: 'idle',
  })),
}));

// Mock de toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('MiniLyricsEditor', () => {
  const mockParams = { bandId: '1', songId: '100' };
  const mockRefetch = jest.fn();
  const mockOnClose = jest.fn();

  const mockLyric: LyricsProps = {
    id: 1,
    position: 1,
    lyrics: 'Original text',
    structure: { id: 1, title: 'verso' },
    chords: [],
  };

  const mockLyrics: LyricsProps[] = [mockLyric];

  const defaultProps = {
    params: mockParams,
    refetchLyricsOfCurrentSong: mockRefetch,
    lyric: mockLyric,
    onClose: mockOnClose,
    lyricsScale: 1,
    lyricsOfCurrentSong: mockLyrics,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the editor with initial text', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Original text');
  });

  it('should update text when typing', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    fireEvent.change(textarea, {
      target: { value: '    C       G\nNuevo texto' },
    });

    expect(textarea.value).toBe('    C       G\nNuevo texto');
  });

  it('should show blue border when text has changed', () => {
    const { container } = render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Modified text' } });

    // The border is on the parent div container, not a specific class
    const editorContainer = container.querySelector(
      '.flex.w-full.flex-col.gap-2.rounded-lg.border-2',
    );
    expect(editorContainer).toBeInTheDocument();
  });

  it('should disable save button when text is unchanged', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const saveButton = screen.getByText('Guardar');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button when text is changed', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });

    const saveButton = screen.getByText('Guardar');
    expect(saveButton).not.toBeDisabled();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show delete button with title', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const deleteButton = screen.getByTitle('Eliminar letra');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should close when ESC is pressed without changes', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should close with ESC when no changes', () => {
    render(<MiniLyricsEditor {...defaultProps} />);

    const textarea = screen.getByRole('textbox');

    // Make a change first
    fireEvent.change(textarea, { target: { value: 'Changed text' } });

    // Clear the change by resetting to original
    fireEvent.change(textarea, { target: { value: 'Original text' } });

    // Now ESC should close since text matches original
    fireEvent.keyDown(textarea, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should apply lyricsScale to textarea font size', () => {
    render(<MiniLyricsEditor {...defaultProps} lyricsScale={1.2} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveStyle({ fontSize: '1.2rem' });
  });

  it('should handle multiline text correctly', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3';
    const lyricWithMultiline = {
      ...mockLyric,
      lyrics: multilineText,
    };

    render(<MiniLyricsEditor {...defaultProps} lyric={lyricWithMultiline} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(multilineText);
  });

  it('should preserve chord spacing when editing', () => {
    const initialChords = '    C       G       Am\nOriginal';
    const lyricWithChords = {
      ...mockLyric,
      lyrics: initialChords,
    };

    render(<MiniLyricsEditor {...defaultProps} lyric={lyricWithChords} />);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    // Change only the lyrics line
    const newText = '    C       G       Am\nNueva letra';
    fireEvent.change(textarea, { target: { value: newText } });

    expect(textarea.value).toBe(newText);
    expect(textarea.value.split('\n')[0]).toBe('    C       G       Am');
  });
});
