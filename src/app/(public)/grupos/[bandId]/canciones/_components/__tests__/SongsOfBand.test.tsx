// Mock nanostores FIRST - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

// Mock other modules BEFORE imports
jest.mock('../../_services/songsOfBandService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../_hooks/useDeleteSong', () => ({
  useDeleteSong: jest.fn(() => ({
    handleDeleteSong: jest.fn(),
    statusDeleteSong: 'idle',
  })),
}));

jest.mock('../../_hooks/useEditSong', () => ({
  useEditSong: jest.fn(() => ({
    form: { title: '', artist: '', key: '', songType: 'worship' },
    setForm: jest.fn(),
    isOpen: false,
    onOpenChange: jest.fn(),
    handleChange: jest.fn(),
    handleUpdateSong: jest.fn(),
    handleOpenModal: jest.fn(),
    statusUpdateSong: 'idle',
  })),
}));

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/FormAddNewSong',
  () => ({
    FormAddNewSong: () => <div data-testid="form-add-new-song">Form</div>,
  }),
);

jest.mock('../AddSongButton', () => ({
  AddSongButton: ({ bandId }: { bandId: string }) => (
    <button data-testid="add-song-button">Add Song {bandId}</button>
  ),
}));

// Mock stores with inline factory
jest.mock('@stores/player', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let playList: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectedSong: any = null;

  return {
    $PlayList: {
      get: () => playList,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any[]) => {
        playList = newValue;
      },
      subscribe: jest.fn(),
    },
    $SelectedSong: {
      get: () => selectedSong,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        selectedSong = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

jest.mock('@global/utils/UIGuard', () => ({
  UIGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-guard">{children}</div>
  ),
}));

// NOW imports
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SongsOfBand } from '../SongsOfBand';
import { getSongsOfBand } from '../../_services/songsOfBandService';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockSongs = [
  {
    id: 1,
    title: 'Amazing Grace',
    artist: 'John Newton',
    key: 'G',
    songType: 'worship' as const,
    youtubeLink: 'https://youtube.com/watch?v=123',
    _count: { events: 5, lyrics: 1 },
  },
  {
    id: 2,
    title: 'Shout to the Lord',
    artist: 'Darlene Zschech',
    key: 'D',
    songType: 'praise' as const,
    youtubeLink: null,
    _count: { events: 3, lyrics: 0 },
  },
  {
    id: 3,
    title: 'How Great is Our God',
    artist: 'Chris Tomlin',
    key: 'C',
    songType: 'worship' as const,
    youtubeLink: 'https://youtube.com/watch?v=456',
    _count: { events: 8, lyrics: 2 },
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'SongsOfBandTestWrapper';
  return Wrapper;
};

describe('SongsOfBand - Table Structure', () => {
  const mockPush = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getSongsOfBand as jest.Mock).mockReturnValue({
      data: mockSongs,
      isLoading: false,
      status: 'success',
      refetch: mockRefetch,
    });
  });

  it('should render as a table structure', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should have correct table headers in desktop', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Headers están ocultos en mobile (hidden sm:table-header-group)
    // pero deben existir en el DOM
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Artista')).toBeInTheDocument();
    expect(screen.getByText('Tonalidad')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Eventos')).toBeInTheDocument();
    expect(screen.getByText('Letra')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('should display all songs in rows', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
    expect(screen.getByText('Shout to the Lord')).toBeInTheDocument();
    expect(screen.getByText('How Great is Our God')).toBeInTheDocument();
  });

  it('should show artist information', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Los artistas pueden aparecer múltiples veces (desktop y mobile)
    expect(screen.getAllByText('John Newton').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Darlene Zschech').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Chris Tomlin').length).toBeGreaterThan(0);
  });

  it('should show key/tonality information', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Las tonalidades aparecen múltiples veces (desktop y mobile)
    const gKeys = screen.getAllByText('G');
    const dKeys = screen.getAllByText('D');
    const cKeys = screen.getAllByText('C');

    expect(gKeys.length).toBeGreaterThan(0);
    expect(dKeys.length).toBeGreaterThan(0);
    expect(cKeys.length).toBeGreaterThan(0);
  });

  it('should show event count', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar que los números de eventos aparezcan
    expect(screen.getByText('5')).toBeInTheDocument(); // Amazing Grace
    expect(screen.getByText('3')).toBeInTheDocument(); // Shout to the Lord
    expect(screen.getByText('8')).toBeInTheDocument(); // How Great is Our God
  });

  it('should indicate when a song has no lyrics', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // "Shout to the Lord" no tiene letra (_count.lyrics: 0)
    const noLyricsWarnings = screen.getAllByText(/sin letra/i);
    expect(noLyricsWarnings.length).toBeGreaterThan(0);
  });

  it('should have action menu for each song', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar que hay botones de menú de acciones
    const actionButtons = screen.getAllByLabelText('Menú de opciones');
    expect(actionButtons.length).toBe(mockSongs.length);
  });

  it('should show song action options including "Editar canción"', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Hacer clic en el primer menú de acciones
    const actionButtons = screen.getAllByLabelText('Menú de opciones');
    fireEvent.click(actionButtons[0]);

    // Verificar que aparecen las opciones del menú incluyendo la nueva de editar
    await waitFor(() => {
      expect(screen.getByText('Ir a canción')).toBeInTheDocument();
      expect(screen.getByText('Escuchar')).toBeInTheDocument();
      expect(screen.getByText('Editar canción')).toBeInTheDocument();
      expect(screen.getByText('Eliminar')).toBeInTheDocument();
    });
  });
});

describe('SongsOfBand - Search and Filters', () => {
  const mockPush = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getSongsOfBand as jest.Mock).mockReturnValue({
      data: mockSongs,
      isLoading: false,
      status: 'success',
      refetch: mockRefetch,
    });
  });

  it('should render search input', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar por título, artista, tonalidad o tipo/i,
    );
    expect(searchInput).toBeInTheDocument();
  });

  it('should render filter buttons', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('🙏 Adoración')).toBeInTheDocument();
    expect(screen.getByText('🎉 Alabanza')).toBeInTheDocument();
  });

  it('should filter songs by search term', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar por título, artista, tonalidad o tipo/i,
    );

    fireEvent.change(searchInput, { target: { value: 'grace' } });

    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
      expect(screen.queryByText('Shout to the Lord')).not.toBeInTheDocument();
      expect(
        screen.queryByText('How Great is Our God'),
      ).not.toBeInTheDocument();
    });
  });

  it('should filter by worship songs', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const worshipButton = screen.getByText('🙏 Adoración');
    fireEvent.click(worshipButton);

    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
      expect(screen.queryByText('Shout to the Lord')).not.toBeInTheDocument();
      expect(screen.getByText('How Great is Our God')).toBeInTheDocument();
    });
  });

  it('should filter by praise songs', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const praiseButton = screen.getByText('🎉 Alabanza');
    fireEvent.click(praiseButton);

    await waitFor(() => {
      expect(screen.queryByText('Amazing Grace')).not.toBeInTheDocument();
      expect(screen.getByText('Shout to the Lord')).toBeInTheDocument();
      expect(
        screen.queryByText('How Great is Our God'),
      ).not.toBeInTheDocument();
    });
  });

  it('should show all songs when clicking "Todas"', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Primero filtrar por adoración
    const worshipButton = screen.getByText('🙏 Adoración');
    fireEvent.click(worshipButton);

    await waitFor(() => {
      expect(screen.queryByText('Shout to the Lord')).not.toBeInTheDocument();
    });

    // Luego volver a mostrar todas
    const allButton = screen.getByText('Todas');
    fireEvent.click(allButton);

    await waitFor(() => {
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
      expect(screen.getByText('Shout to the Lord')).toBeInTheDocument();
      expect(screen.getByText('How Great is Our God')).toBeInTheDocument();
    });
  });

  it('should show correct count of filtered results', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Inicialmente debe mostrar "3 de 3 canciones"
    expect(screen.getByText(/3 de 3 canciones/i)).toBeInTheDocument();

    // Filtrar por adoración (2 canciones)
    const worshipButton = screen.getByText('🙏 Adoración');
    fireEvent.click(worshipButton);

    await waitFor(() => {
      expect(screen.getByText(/2 de 3 canciones/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no results found', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar por título, artista, tonalidad o tipo/i,
    );

    fireEvent.change(searchInput, { target: { value: 'nonexistent song' } });

    await waitFor(() => {
      expect(
        screen.getByText(/no se encontraron canciones/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/intenta con otros términos de búsqueda o filtros/i),
      ).toBeInTheDocument();
    });
  });

  it('should normalize search text (remove accents)', async () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar por título, artista, tonalidad o tipo/i,
    );

    // Buscar con acentos
    fireEvent.change(searchInput, { target: { value: 'adoración' } });

    await waitFor(() => {
      // Debe encontrar las canciones de tipo "worship" que se muestran como "Adoración"
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
    });
  });
});

describe('SongsOfBand - Responsive Layout', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getSongsOfBand as jest.Mock).mockReturnValue({
      data: mockSongs,
      isLoading: false,
      status: 'success',
      refetch: jest.fn(),
    });
  });

  it('should have filter buttons with flex-wrap for mobile responsiveness', () => {
    const { container } = render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar que el contenedor de botones de filtro tiene flex-wrap
    const filterContainer = container.querySelector('.flex.flex-wrap.gap-2');
    expect(filterContainer).toBeInTheDocument();
  });

  it('should have whitespace-nowrap on filter buttons to prevent text wrapping', () => {
    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Buscar botones de filtro y verificar que tengan whitespace-nowrap
    const allButton = screen.getByText('Todas').closest('button');
    const worshipButton = screen.getByText('🙏 Adoración').closest('button');
    const praiseButton = screen.getByText('🎉 Alabanza').closest('button');

    expect(allButton).toHaveClass('whitespace-nowrap');
    expect(worshipButton).toHaveClass('whitespace-nowrap');
    expect(praiseButton).toHaveClass('whitespace-nowrap');
  });

  it('should have table with max-w-full and overflow-x-auto for mobile scrolling', () => {
    const { container } = render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar el contenedor de la tabla
    const tableContainer = container.querySelector(
      '.max-w-full.overflow-x-auto',
    );
    expect(tableContainer).toBeInTheDocument();

    // Verificar que la tabla tiene min-w-full
    const table = container.querySelector('table');
    expect(table).toHaveClass('min-w-full', 'w-full');
  });
});

describe('SongsOfBand - Empty State', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should show empty state when no songs exist', () => {
    (getSongsOfBand as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      status: 'success',
      refetch: jest.fn(),
    });

    render(<SongsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/no hay canciones aún/i)).toBeInTheDocument();
    expect(
      screen.getByText(/comienza agregando canciones al repertorio/i),
    ).toBeInTheDocument();
  });
});
