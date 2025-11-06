import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StoredLyricsAlert } from '../StoredLyricsAlert';

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock lyricsStorage
const mockGetAllTempLyrics = jest.fn();
const mockDeleteTempLyrics = jest.fn();

jest.mock('../../_utils/lyricsStorage', () => ({
  getAllTempLyrics: () => mockGetAllTempLyrics(),
  deleteTempLyrics: (...args: unknown[]) => mockDeleteTempLyrics(...args),
}));

describe('StoredLyricsAlert', () => {
  const mockLyrics = [
    {
      songId: '100',
      bandId: '1',
      text: 'Test lyrics for song 100',
      timestamp: Date.now(),
      songTitle: 'Amazing Song',
    },
    {
      songId: '101',
      bandId: '1',
      text: 'Test lyrics for song 101',
      timestamp: Date.now() - 1000,
      songTitle: 'Another Song',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllTempLyrics.mockReturnValue([]);
  });

  it('should not render when there are no stored lyrics', () => {
    mockGetAllTempLyrics.mockReturnValue([]);

    const { container } = render(<StoredLyricsAlert />);
    expect(container.firstChild).toBeNull();
  });

  it('should render alert when there are stored lyrics', () => {
    mockGetAllTempLyrics.mockReturnValue(mockLyrics);

    render(<StoredLyricsAlert />);

    expect(screen.getByText('Letras sin guardar')).toBeInTheDocument();
    expect(screen.getByText('Amazing Song')).toBeInTheDocument();
    expect(screen.getByText('Another Song')).toBeInTheDocument();
  });

  it('should show count of pending lyrics when minimized', () => {
    mockGetAllTempLyrics.mockReturnValue(mockLyrics);

    render(<StoredLyricsAlert />);

    const header = screen.getByText('Letras sin guardar').closest('div');
    fireEvent.click(header!);

    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/pendientes/)).toBeInTheDocument();
  });

  it('should toggle between minimized and expanded states', () => {
    mockGetAllTempLyrics.mockReturnValue(mockLyrics);

    render(<StoredLyricsAlert />);

    // Initially expanded
    expect(
      screen.getByText('Tienes letras pendientes por terminar'),
    ).toBeInTheDocument();

    // Click to minimize
    const header = screen.getByText('Letras sin guardar').closest('div');
    fireEvent.click(header!);

    // Should be minimized
    expect(
      screen.queryByText('Tienes letras pendientes por terminar'),
    ).not.toBeInTheDocument();

    // Click to expand again
    fireEvent.click(header!);

    // Should be expanded
    expect(
      screen.getByText('Tienes letras pendientes por terminar'),
    ).toBeInTheDocument();
  });

  it('should display song information correctly', () => {
    mockGetAllTempLyrics.mockReturnValue([mockLyrics[0]]);

    render(<StoredLyricsAlert />);

    expect(screen.getByText('Amazing Song')).toBeInTheDocument();
    expect(screen.getByText(/caracteres/)).toBeInTheDocument();
  });

  it('should show "Canción X" when songTitle is not provided', () => {
    const lyricWithoutTitle = {
      ...mockLyrics[0],
      songTitle: undefined,
    };
    mockGetAllTempLyrics.mockReturnValue([lyricWithoutTitle]);

    render(<StoredLyricsAlert />);

    expect(screen.getByText('Canción 100')).toBeInTheDocument();
  });

  it('should call deleteTempLyrics when delete button is clicked', () => {
    mockGetAllTempLyrics.mockReturnValue([mockLyrics[0]]);

    render(<StoredLyricsAlert />);

    const deleteButton = screen.getByTitle('Eliminar borrador');
    fireEvent.click(deleteButton);

    expect(mockDeleteTempLyrics).toHaveBeenCalledWith('1', '100');
  });

  it('should dispatch custom event when deleting lyrics', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent');
    mockGetAllTempLyrics.mockReturnValue([mockLyrics[0]]);

    render(<StoredLyricsAlert />);

    const deleteButton = screen.getByTitle('Eliminar borrador');
    fireEvent.click(deleteButton);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'lyricsStorageChange' }),
    );

    dispatchSpy.mockRestore();
  });

  it('should render navigation links correctly with edit-lyrics hash', () => {
    mockGetAllTempLyrics.mockReturnValue([mockLyrics[0]]);

    render(<StoredLyricsAlert />);

    const link = screen.getByText('Ir').closest('a');
    expect(link).toHaveAttribute('href', '/grupos/1/canciones/100#edit-lyrics');
  });

  it('should display timestamp in localized format', () => {
    const mockDate = new Date('2025-01-15T10:30:00');
    const lyricWithDate = {
      ...mockLyrics[0],
      timestamp: mockDate.getTime(),
    };
    mockGetAllTempLyrics.mockReturnValue([lyricWithDate]);

    render(<StoredLyricsAlert />);

    // Check that date appears (format may vary by locale)
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('should show singular form for 1 pending lyric when minimized', () => {
    mockGetAllTempLyrics.mockReturnValue([mockLyrics[0]]);

    render(<StoredLyricsAlert />);

    const header = screen.getByText('Letras sin guardar').closest('div');
    fireEvent.click(header!);

    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/pendiente/)).toBeInTheDocument();
  });

  it('should listen to storage events', async () => {
    mockGetAllTempLyrics
      .mockReturnValueOnce([])
      .mockReturnValueOnce(mockLyrics);

    const { rerender } = render(<StoredLyricsAlert />);

    // Initially no lyrics
    expect(screen.queryByText('Letras sin guardar')).not.toBeInTheDocument();

    // Simulate storage event
    fireEvent(window, new Event('storage'));

    // Should reload and show lyrics
    rerender(<StoredLyricsAlert />);
    await waitFor(() => {
      expect(screen.getByText('Letras sin guardar')).toBeInTheDocument();
    });
  });

  it('should display character count for each lyric', () => {
    const lyricWithText = {
      ...mockLyrics[0],
      text: 'A'.repeat(150),
    };
    mockGetAllTempLyrics.mockReturnValue([lyricWithText]);

    render(<StoredLyricsAlert />);

    expect(screen.getByText('150 caracteres')).toBeInTheDocument();
  });

  it('should handle multiple lyrics from different bands', () => {
    const mixedLyrics = [
      { ...mockLyrics[0], bandId: '1' },
      { ...mockLyrics[1], bandId: '2' },
    ];
    mockGetAllTempLyrics.mockReturnValue(mixedLyrics);

    render(<StoredLyricsAlert />);

    const links = screen.getAllByText('Ir');
    expect(links[0].closest('a')).toHaveAttribute(
      'href',
      '/grupos/1/canciones/100#edit-lyrics',
    );
    expect(links[1].closest('a')).toHaveAttribute(
      'href',
      '/grupos/2/canciones/101#edit-lyrics',
    );
  });

  it('should apply correct styling classes', () => {
    mockGetAllTempLyrics.mockReturnValue(mockLyrics);

    render(<StoredLyricsAlert />);

    // Find the outermost container with fixed positioning
    const alertElement = screen.getByText('Letras sin guardar');
    // Navigate up to find the fixed container
    let container = alertElement.parentElement;
    while (container && !container.classList.contains('fixed')) {
      container = container.parentElement;
    }
    expect(container).toHaveClass('fixed', 'bottom-4', 'right-4', 'z-50');
  });
});
