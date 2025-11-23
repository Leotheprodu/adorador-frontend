import { render, screen } from '@testing-library/react';
import { SongShareFields } from '../SongShareFields';

// Mock de NextUI
jest.mock('@nextui-org/react', () => ({
    Select: ({
        children,
        label,
        onSelectionChange,
        selectedKeys,
    }: {
        children: React.ReactNode;
        label?: string;
        onSelectionChange?: (keys: Set<string>) => void;
        selectedKeys?: string[];
    }) => (
        <div>
            <label>{label}</label>
            <select
                onChange={(e) => {
                    if (onSelectionChange) {
                        onSelectionChange(new Set([e.target.value]));
                    }
                }}
                value={selectedKeys?.[0] || ''}
            >
                {children}
            </select>
        </div>
    ),
    SelectItem: ({
        children,
        textValue,
    }: {
        children: React.ReactNode;
        textValue?: string;
    }) => <option value={textValue}>{children}</option>,
}));

describe('SongShareFields', () => {
    const mockOnSongChange = jest.fn();
    const bandSongs = [
        { id: 1, title: 'Canción 1', artist: 'Artista 1' },
        { id: 2, title: 'Canción 2', artist: null },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza correctamente', () => {
        render(
            <SongShareFields
                sharedSongId=""
                bandSongs={bandSongs}
                selectedSongInfo={null}
                onSongChange={mockOnSongChange}
            />,
        );

        expect(screen.getByText('Canción a compartir')).toBeInTheDocument();
    });

    it('muestra información de la canción seleccionada', () => {
        render(
            <SongShareFields
                sharedSongId="1"
                bandSongs={bandSongs}
                selectedSongInfo={{ title: 'Canción 1', artist: 'Artista 1' }}
                onSongChange={mockOnSongChange}
            />,
        );

        expect(screen.getByText('Canción 1')).toBeInTheDocument();
        expect(screen.getByText('Artista 1')).toBeInTheDocument();
    });

    it('muestra placeholder cuando no hay canción seleccionada', () => {
        render(
            <SongShareFields
                sharedSongId=""
                bandSongs={bandSongs}
                selectedSongInfo={null}
                onSongChange={mockOnSongChange}
            />,
        );

        expect(screen.getByText('Selecciona una canción')).toBeInTheDocument();
    });
});
