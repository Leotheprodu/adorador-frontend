import React from 'react';
import { render, screen } from '@testing-library/react';
import { LyricsGroupedCard } from '../LyricsGroupedCard';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock hooks
jest.mock('../../_hooks/useLyricsGroupDragDrop', () => ({
    useLyricsGroupDragDrop: jest.fn(() => ({
        lyricsOrder: [
            {
                id: 1,
                position: 1,
                lyrics: 'Test lyrics 1',
                structure: { id: 1, title: 'verso' },
                chords: [],
            },
            {
                id: 2,
                position: 2,
                lyrics: 'Test lyrics 2',
                structure: { id: 1, title: 'verso' },
                chords: [],
            },
        ],
        handleDragEnd: jest.fn(),
    })),
}));

jest.mock('../../_hooks/useLyricsInsertion', () => ({
    useLyricsInsertion: jest.fn(() => ({
        insertPosition: null,
        openInsertAt: jest.fn(),
        closeInsert: jest.fn(),
    })),
}));

// Mock sub-components
jest.mock('../LyricsCard', () => ({
    LyricsCard: ({ lyric }: { lyric: LyricsProps }) => (
        <div data-testid={`lyrics-card-${lyric.id}`}>{lyric.lyrics}</div>
    ),
}));

jest.mock('../MiniLyricsCreator', () => ({
    MiniLyricsCreator: () => <div data-testid="mini-lyrics-creator">Creator</div>,
}));

jest.mock('../lyrics/LyricsInsertButton', () => ({
    LyricsInsertButton: ({ position }: { position: string }) => (
        <button data-testid={`insert-btn-${position}`}>Insert {position}</button>
    ),
}));

// Mock dnd
jest.mock('@hello-pangea/dnd', () => ({
    DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Droppable: ({ children }: { children: (provided: unknown, snapshot: unknown) => React.ReactNode }) =>
        children(
            {
                droppableProps: { 'data-testid': 'droppable' },
                innerRef: jest.fn(),
                placeholder: <div data-testid="placeholder" />,
            },
            {},
        ),
}));

// Mock constants
jest.mock('@global/config/constants', () => ({
    structureColors: { verso: 'blue' },
    structureLib: { verso: { es: 'Verso' } },
}));

describe('LyricsGroupedCard', () => {
    const mockLyrics: LyricsProps[] = [
        {
            id: 1,
            position: 1,
            lyrics: 'Test lyrics 1',
            structure: { id: 1, title: 'verso' },
            chords: [],
        },
        {
            id: 2,
            position: 2,
            lyrics: 'Test lyrics 2',
            structure: { id: 1, title: 'verso' },
            chords: [],
        },
    ];

    const defaultProps = {
        structure: 'verso',
        lyrics: mockLyrics,
        refetchLyricsOfCurrentSong: jest.fn(),
        params: { bandId: '1', songId: '1' },
        chordPreferences: { noteType: 'regular' },
        lyricsOfCurrentSong: mockLyrics,
        transpose: 0,
        showChords: true,
        lyricsScale: 1,
        isPracticeMode: false,
    };

    it('renders structure title', () => {
        render(<LyricsGroupedCard {...defaultProps} />);
        expect(screen.getByText('Verso')).toBeInTheDocument();
    });

    it('renders lyrics cards', () => {
        render(<LyricsGroupedCard {...defaultProps} />);
        expect(screen.getByTestId('lyrics-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('lyrics-card-2')).toBeInTheDocument();
    });

    it('renders insert buttons in edit mode', () => {
        render(<LyricsGroupedCard {...defaultProps} />);
        // Should see insert buttons
        expect(screen.getAllByTestId(/insert-btn-/)).toHaveLength(3); // Before first, after first, after second
    });

    it('does not render insert buttons in practice mode', () => {
        render(<LyricsGroupedCard {...defaultProps} isPracticeMode={true} />);
        expect(screen.queryByTestId(/insert-btn-/)).not.toBeInTheDocument();
    });

    it('renders creator when insertPosition matches', async () => {
        const { useLyricsInsertion } = await import('../../_hooks/useLyricsInsertion');
        (useLyricsInsertion as jest.Mock).mockReturnValue({
            insertPosition: 1, // Matches first lyric position
            openInsertAt: jest.fn(),
            closeInsert: jest.fn(),
        });

        render(<LyricsGroupedCard {...defaultProps} />);
        expect(screen.getByTestId('mini-lyrics-creator')).toBeInTheDocument();
    });
});
