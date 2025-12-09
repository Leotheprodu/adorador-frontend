import { render, screen, fireEvent } from '@testing-library/react';
import { SongBasicInfo } from '../SongBasicInfo';
import { SongPropsWithCount } from '../../../_interfaces/songsInterface';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { $PlayList, $SelectedSong } from '@stores/player';

// Mock de stores
jest.mock('@stores/player', () => ({
  $PlayList: {
    set: jest.fn(),
    subscribe: jest.fn(),
  },
  $SelectedSong: {
    set: jest.fn(),
    subscribe: jest.fn(),
  },
}));

// Mock de nanostores/react
jest.mock('@nanostores/react', () => ({
  useStore: jest.fn((store) => {
    if (store === $PlayList) {
      return [{ id: 0, name: '', youtubeLink: '' }];
    }
    if (store === $SelectedSong) {
      return null;
    }
    return null;
  }),
}));

// Mock de NextUI components
jest.mock('@heroui/react', () => ({
  Button: ({
    children,
    onClick,
    className,
    startContent,
    ...props
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    startContent?: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} className={className} {...props}>
      {startContent}
      {children}
    </button>
  ),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

// Mock de Next Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock de componentes hijos
jest.mock('../RehearsalControlsModal', () => ({
  RehearsalControlsModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>RehearsalControlsModal</div> : null,
}));

jest.mock('@bands/[bandId]/canciones/_components/EditSongButton', () => ({
  EditSongButton: () => <button>Editar Detalles</button>,
}));

jest.mock('@bands/[bandId]/canciones/_components/DeleteSongButton', () => ({
  DeleteSongButton: () => <button>Eliminar</button>,
}));

jest.mock('../ButtonNormalizeLyrics', () => ({
  ButtonNormalizeLyrics: () => <button>Normalizar</button>,
}));

describe('SongBasicInfo', () => {
  const mockRefetch = jest.fn();
  const mockRefetchLyrics = jest.fn();
  const mockOnPracticeModeChange = jest.fn();
  const mockOnEditModeChange = jest.fn();

  const mockSongData: SongPropsWithCount = {
    id: 1,
    title: 'Amazing Grace',
    artist: 'John Newton',
    key: 'G',
    tempo: 120,
    songType: 'worship',
    youtubeLink: 'dQw4w9WgXcQ',
    _count: {
      lyrics: 2,
      events: 0,
    },
  };

  const mockLyrics: LyricsProps[] = [
    {
      id: 1,
      position: 1,
      lyrics: 'Verse 1',
      structure: {
        id: 1,
        title: 'Verse',
      },
      chords: [],
    },
    {
      id: 2,
      position: 2,
      lyrics: 'Chorus',
      structure: {
        id: 2,
        title: 'Chorus',
      },
      chords: [],
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render song title', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
  });

  it('should display song metadata (artist, type, key, tempo)', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText('John Newton')).toBeInTheDocument();
    expect(screen.getByText('Adoración')).toBeInTheDocument(); // songTypes.worship.es
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('120 BPM')).toBeInTheDocument();
  });

  it('should display song metadata (artist, type, key, tempo)', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText('John Newton')).toBeInTheDocument();
    expect(screen.getByText('Adoración')).toBeInTheDocument(); // songTypes.WORSHIP.es
    expect(screen.getByText('G')).toBeInTheDocument();
    expect(screen.getByText('120 BPM')).toBeInTheDocument();
  });

  it('should render YouTube thumbnail when youtubeLink exists', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    const thumbnail = screen.getByRole('img', { name: 'Amazing Grace' });
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute(
      'src',
      'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });

  it('should not render YouTube thumbnail when youtubeLink is undefined', () => {
    const songWithoutYoutube: SongPropsWithCount = {
      ...mockSongData,
      youtubeLink: undefined,
    };

    render(
      <SongBasicInfo
        data={songWithoutYoutube}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    const thumbnail = screen.queryByRole('img', { name: 'Amazing Grace' });
    expect(thumbnail).not.toBeInTheDocument();
  });

  it('should render play button when youtubeLink exists', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    expect(screen.getByText('Reproducir')).toBeInTheDocument();
  });

  it('should render YouTube link button when youtubeLink exists', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    const youtubeButton = screen.getByText('Ver en YouTube');
    expect(youtubeButton).toBeInTheDocument();
    expect(youtubeButton).toHaveAttribute(
      'href',
      'https://youtu.be/dQw4w9WgXcQ',
    );
    expect(youtubeButton).toHaveAttribute('target', '_blank');
  });

  it('should not render play/YouTube buttons when youtubeLink is undefined', () => {
    const songWithoutYoutube: SongPropsWithCount = {
      ...mockSongData,
      youtubeLink: undefined,
    };

    render(
      <SongBasicInfo
        data={songWithoutYoutube}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.queryByText('Reproducir')).not.toBeInTheDocument();
    expect(screen.queryByText('Ver en YouTube')).not.toBeInTheDocument();
  });

  it('should render controls button', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    expect(screen.getByText('Controles')).toBeInTheDocument();
  });

  it('should render edit button in edit mode', () => {
    const mockLyrics: LyricsProps[] = [
      {
        id: 1,
        position: 1,
        lyrics: 'Test lyrics',
        structure: { id: 1, title: 'verso' },
        chords: [],
      },
    ];

    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={false}
        onPracticeModeChange={mockOnPracticeModeChange}
        lyrics={mockLyrics}
      />,
    );

    expect(screen.getByText('Editar Detalles')).toBeInTheDocument();
  });

  it('should render normalize button when lyrics exist', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        lyrics={mockLyrics}
        refetchLyricsOfCurrentSong={mockRefetchLyrics}
      />,
    );

    expect(screen.getByText('Normalizar')).toBeInTheDocument();
  });

  it('should not render normalize button when lyrics are empty', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        lyrics={[]}
        refetchLyricsOfCurrentSong={mockRefetchLyrics}
      />,
    );

    expect(screen.queryByText('Normalizar')).not.toBeInTheDocument();
  });

  it('should not render normalize button when lyrics prop is undefined', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.queryByText('Normalizar')).not.toBeInTheDocument();
  });

  it('should render delete button when song has no lyrics', () => {
    const songWithoutLyrics: SongPropsWithCount = {
      ...mockSongData,
      _count: { lyrics: 0, events: 0 },
    };

    render(
      <SongBasicInfo
        data={songWithoutLyrics}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('should not render delete button when song has lyrics', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.queryByText('Eliminar')).not.toBeInTheDocument();
  });

  it('should call $SelectedSong.set when play button is clicked', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    const playButton = screen.getByText('Reproducir');
    fireEvent.click(playButton);

    expect($SelectedSong.set).toHaveBeenCalledWith({
      id: 1,
      name: 'Amazing Grace',
      youtubeLink: 'dQw4w9WgXcQ',
    });
  });

  it('should apply minimalist CSS classes to play button', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    const playButton = screen.getByText('Reproducir');
    expect(playButton).toHaveClass('border-2');
    expect(playButton).toHaveClass('border-slate-200');
    expect(playButton).toHaveClass('hover:border-brand-purple-300');
    expect(playButton).toHaveClass('bg-white');
  });

  it('should apply minimalist CSS classes to controls button', () => {
    render(
      <SongBasicInfo
        data={mockSongData}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
        isPracticeMode={true}
        onPracticeModeChange={mockOnPracticeModeChange}
      />,
    );

    const controlsButton = screen.getByText('Controles');
    expect(controlsButton).toHaveClass('border-2');
    expect(controlsButton).toHaveClass('border-slate-200');
    expect(controlsButton).toHaveClass('hover:border-brand-purple-300');
    expect(controlsButton).toHaveClass('bg-white');
  });

  it('should handle missing optional metadata gracefully', () => {
    const minimalSong: SongPropsWithCount = {
      id: 1,
      title: 'Minimal Song',
      artist: undefined,
      key: undefined,
      tempo: undefined,
      songType: 'worship',
      youtubeLink: undefined,
      _count: {
        lyrics: 0,
        events: 0,
      },
    };

    render(
      <SongBasicInfo
        data={minimalSong}
        status="success"
        bandId="1"
        songId="1"
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText('Minimal Song')).toBeInTheDocument();
    expect(screen.getByText('Adoración')).toBeInTheDocument();
    // Should not show metadata that doesn't exist
    expect(screen.queryByText('BPM')).not.toBeInTheDocument();
  });

  describe('Practice/Edit Mode Toggle', () => {
    const mockLyrics: LyricsProps[] = [
      {
        id: 1,
        position: 1,
        lyrics: 'Test lyrics',
        structure: { id: 1, title: 'verso' },
        chords: [],
      },
    ];

    it('should render toggle button when in practice mode', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={true}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
        />,
      );

      expect(screen.getByText('Modo Práctica')).toBeInTheDocument();
      expect(screen.getByText('Haz clic para editar')).toBeInTheDocument();
    });

    it('should render toggle button when in edit mode', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={false}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
        />,
      );

      expect(screen.getByText('Modo Edición')).toBeInTheDocument();
      expect(screen.getByText('Haz clic para practicar')).toBeInTheDocument();
    });

    it('should call onPracticeModeChange when toggle button is clicked', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={true}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
        />,
      );

      const toggleButton = screen.getByText('Modo Práctica');
      fireEvent.click(toggleButton);

      expect(mockOnPracticeModeChange).toHaveBeenCalledWith(false);
    });

    it('should show practice mode buttons when isPracticeMode is true', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={true}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
        />,
      );

      expect(screen.getByText('Reproducir')).toBeInTheDocument();
      expect(screen.getByText('Ver en YouTube')).toBeInTheDocument();
      expect(screen.getByText('Controles')).toBeInTheDocument();

      // Edit mode buttons should not be visible
      expect(screen.queryByText('Editar Letra')).not.toBeInTheDocument();
      expect(screen.queryByText('Editar Detalles')).not.toBeInTheDocument();
    });

    it('should show edit mode buttons when isPracticeMode is false', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={false}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
          isEditMode={false}
          onEditModeChange={mockOnEditModeChange}
          refetchLyricsOfCurrentSong={mockRefetchLyrics}
        />,
      );

      expect(screen.getByText('Editar Letra')).toBeInTheDocument();
      expect(screen.getByText('Editar Detalles')).toBeInTheDocument();
      expect(screen.getByText('Normalizar')).toBeInTheDocument();

      // Practice mode buttons should not be visible
      expect(screen.queryByText('Reproducir')).not.toBeInTheDocument();
      expect(screen.queryByText('Ver en YouTube')).not.toBeInTheDocument();
      expect(screen.queryByText('Controles')).not.toBeInTheDocument();
    });

    it('should show "Ver Letra" button when in edit mode and isEditMode is true', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={false}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
          isEditMode={true}
          onEditModeChange={mockOnEditModeChange}
          refetchLyricsOfCurrentSong={mockRefetchLyrics}
        />,
      );

      expect(screen.getByText('Ver Letra')).toBeInTheDocument();
      expect(screen.queryByText('Editar Letra')).not.toBeInTheDocument();
    });

    it('should call onEditModeChange when "Editar Letra" button is clicked', () => {
      render(
        <SongBasicInfo
          data={mockSongData}
          status="success"
          bandId="1"
          songId="1"
          refetch={mockRefetch}
          isPracticeMode={false}
          onPracticeModeChange={mockOnPracticeModeChange}
          lyrics={mockLyrics}
          isEditMode={false}
          onEditModeChange={mockOnEditModeChange}
          refetchLyricsOfCurrentSong={mockRefetchLyrics}
        />,
      );

      const editLyricsButton = screen.getByText('Editar Letra');
      fireEvent.click(editLyricsButton);

      expect(mockOnEditModeChange).toHaveBeenCalledWith(true);
    });
  });
});
