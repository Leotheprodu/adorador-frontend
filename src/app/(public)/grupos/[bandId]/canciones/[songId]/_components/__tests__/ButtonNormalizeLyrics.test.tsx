// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@heroui/react', () => {
  const original = jest.requireActual('@heroui/react');
  return {
    ...original,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Button: ({ href, children, ...props }: any) =>
      href ? (
        <a href={href} {...props}>
          {children}
        </a>
      ) : (
        <button type="button" {...props}>
          {children}
        </button>
      ),
  };
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonNormalizeLyrics } from '../ButtonNormalizeLyrics';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock the service
const mockMutate = jest.fn();
const mockStatus = 'idle';

jest.mock('../../_services/songIdServices', () => ({
  normalizeLyricsService: jest.fn(() => ({
    mutate: mockMutate,
    status: mockStatus,
    data: null,
  })),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ButtonNormalizeLyrics', () => {
  const mockParams = { bandId: '1', songId: '100' };
  const mockRefetch = jest.fn();

  const mockLyrics: LyricsProps[] = [
    {
      id: 1,
      lyrics: 'Test lyrics 1',
      position: 1,
      structure: { id: 1, title: 'Verso' },
      chords: [],
    },
    {
      id: 2,
      lyrics: 'Test lyrics 2',
      position: 2,
      structure: { id: 2, title: 'Coro' },
      chords: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the normalize button', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(screen.getByText('Normalizar')).toBeInTheDocument();
  });

  it('should not render when lyrics array is empty', () => {
    const { container } = render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={[]}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should open modal when button is clicked', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    fireEvent.click(button);

    expect(
      screen.getByText('Normalizar Formato de Letras'),
    ).toBeInTheDocument();
  });

  it('should display correct number of lyrics in modal', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    fireEvent.click(button);

    expect(screen.getByText(/2 letras/)).toBeInTheDocument();
  });

  it('should show normalization details in modal', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    fireEvent.click(button);

    expect(screen.getByText(/¿Qué hace la normalización?/)).toBeInTheDocument();
    expect(screen.getByText(/Ajusta el espaciado/)).toBeInTheDocument();
    expect(screen.getByText(/Corrige la posición/)).toBeInTheDocument();
  });

  it('should display warning message', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    fireEvent.click(button);

    expect(
      screen.getByText(/Este proceso es irreversible/),
    ).toBeInTheDocument();
  });

  it('should have cancel and normalize buttons in modal', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    fireEvent.click(button);

    expect(
      screen.getByRole('button', { name: /Cancelar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Normalizar/i }),
    ).toBeInTheDocument();
  });

  it('should disable button when processing', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    expect(button).not.toBeDisabled();
  });

  it('should not show emoji icon (removed for minimalist design)', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    expect(screen.queryByText('✨')).not.toBeInTheDocument();
  });

  it('should apply correct minimalist CSS classes', () => {
    render(
      <ButtonNormalizeLyrics
        params={mockParams}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetch}
      />,
    );

    const button = screen.getByText('Normalizar');
    expect(button).toHaveClass('border-2');
    expect(button).toHaveClass('border-slate-200');
    expect(button).toHaveClass('hover:border-brand-purple-300');
    expect(button).toHaveClass('bg-white');
  });
});
