import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LyricsCard } from '../LyricsCard';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

// Mock hooks
jest.mock('../../_hooks/useLyricsCard', () => ({
    useLyricsCard: jest.fn(() => ({
        updateLyric: false,
        isDragging: false,
        setIsDragging: jest.fn(),
        handleClickLyric: jest.fn(),
        handleCloseEditor: jest.fn(),
    })),
}));

// Mock sub-components
jest.mock('../lyrics/LyricsContent', () => ({
    LyricsContent: ({ lyric }: { lyric: LyricsProps }) => (
        <div data-testid="lyrics-content">{lyric.lyrics}</div>
    ),
}));

jest.mock('../lyrics/LyricsDragHandle', () => ({
    LyricsDragHandle: () => <div data-testid="lyrics-drag-handle">DragHandle</div>,
}));

jest.mock('../MiniLyricsEditor', () => ({
    MiniLyricsEditor: () => <div data-testid="mini-lyrics-editor">Editor</div>,
}));

// Mock dnd
jest.mock('@hello-pangea/dnd', () => ({
    Draggable: ({ children }: any) =>
        children(
            {
                draggableProps: { 'data-testid': 'draggable' },
                dragHandleProps: { 'data-testid': 'drag-handle' },
                innerRef: jest.fn(),
            },
            { isDragging: false },
        ),
}));

describe('LyricsCard', () => {
    const mockLyric: LyricsProps = {
        id: 1,
        position: 1,
        lyrics: 'Test lyrics',
        structure: { id: 1, title: 'verso' },
        chords: [],
    };

    const defaultProps = {
        lyric: mockLyric,
        index: 0,
        refetchLyricsOfCurrentSong: jest.fn(),
        params: { bandId: '1', songId: '1' },
        chordPreferences: { noteType: 'regular' },
        lyricsOfCurrentSong: [mockLyric],
        transpose: 0,
        showChords: true,
        lyricsScale: 1,
        isPracticeMode: false,
    };

    it('renders lyrics content in view mode', () => {
        render(<LyricsCard {...defaultProps} />);
        expect(screen.getByTestId('lyrics-content')).toHaveTextContent('Test lyrics');
        expect(screen.getByTestId('lyrics-drag-handle')).toBeInTheDocument();
    });

    it('renders editor when updateLyric is true', () => {
        // Override hook mock for this test
        const useLyricsCard = require('../../_hooks/useLyricsCard').useLyricsCard;
        useLyricsCard.mockReturnValue({
            updateLyric: true,
            isDragging: false,
            setIsDragging: jest.fn(),
            handleClickLyric: jest.fn(),
            handleCloseEditor: jest.fn(),
        });

        render(<LyricsCard {...defaultProps} />);
        expect(screen.getByTestId('mini-lyrics-editor')).toBeInTheDocument();
        expect(screen.queryByTestId('lyrics-drag-handle')).not.toBeInTheDocument();
    });

    it('renders correctly in practice mode', () => {
        render(<LyricsCard {...defaultProps} isPracticeMode={true} />);
        expect(screen.getByTestId('lyrics-content')).toBeInTheDocument();
        // In practice mode, it shouldn't be draggable, so no drag handle from Draggable (mocked differently if needed, but logic handles return early)
        // Actually in the component: if (isPracticeMode) return ... (no Draggable)
        // So we need to check if Draggable mock is NOT used or if the structure is different.
        // The component returns a div directly, not wrapped in Draggable.
        // Our mock of Draggable renders children.
        // But in practice mode, Draggable is NOT used.

        // Let's verify it renders content but NOT the drag handle from the Draggable render prop logic (which adds the handle)
        // Wait, in practice mode, the component renders LyricsContent directly.
        // And NO LyricsDragHandle.
        expect(screen.queryByTestId('lyrics-drag-handle')).not.toBeInTheDocument();
    });
});
