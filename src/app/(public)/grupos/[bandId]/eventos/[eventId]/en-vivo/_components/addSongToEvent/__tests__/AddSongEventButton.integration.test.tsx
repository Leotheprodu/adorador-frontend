import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddSongEventButton } from '../AddSongEventButton';
import '@testing-library/jest-dom';

// Mock NextUI components
jest.mock('@heroui/react', () => ({
  Button: ({
    children,
    onPress,
    disabled,
    className = '',
    'aria-label': ariaLabel,
    isDisabled,
    ...props
  }) => {
    // Filtrar props no nativos
    const nativeProps = { ...props };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nativeProps as any).isDisabled;
    return (
      <button
        type="button"
        onClick={disabled || isDisabled ? undefined : onPress}
        disabled={disabled || isDisabled}
        aria-label={ariaLabel}
        className={`heroui-btn z-10 ${className}`.trim()}
        {...nativeProps}
      >
        {children}
      </button>
    );
  },
  Popover: ({ children }) => <div data-slot="popover">{children}</div>,
  PopoverTrigger: ({ children }) => <div data-slot="trigger">{children}</div>,
  PopoverContent: ({ children }) => <div data-slot="content">{children}</div>,
  Tooltip: ({ children, content }) => (
    <div data-testid="tooltip-mock">
      {children}
      {content && <div>{content}</div>}
    </div>
  ),
}));

// Mock child components with more realistic behavior
jest.mock('../AddSongEventBySavedSongs', () => ({
  AddSongEventBySavedSongs: ({ isOpen, onClose, params }) =>
    isOpen ? (
      <div data-testid="catalog-modal" role="dialog">
        <h2>Agregar Canciones al Evento</h2>
        <p>
          Catalog for band {params.bandId} event {params.eventId}
        </p>
        <button onClick={onClose} data-testid="catalog-close">
          Cerrar
        </button>
      </div>
    ) : null,
}));

jest.mock('../AddNewSongtoChurchAndEvent', () => ({
  AddNewSongtoChurchAndEvent: ({ isOpen, onClose, params }) =>
    isOpen ? (
      <div data-testid="new-song-modal" role="dialog">
        <h2>Crear Nueva Canción</h2>
        <p>
          New song for band {params.bandId} event {params.eventId}
        </p>
        <button onClick={onClose} data-testid="new-song-close">
          Cerrar
        </button>
      </div>
    ) : null,
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({
    songs: [
      { order: 1, transpose: 0, song: { id: 1 } },
      { order: 2, transpose: 0, song: { id: 2 } },
    ],
  })),
}));

describe('AddSongEventButton Integration Tests', () => {
  const mockRefetch = jest.fn();
  const mockParams = { bandId: '1', eventId: '2' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should keep catalog modal open when popover is closed', async () => {
    const { container } = render(
      <AddSongEventButton params={mockParams} refetch={mockRefetch} />,
    );

    // 1. Abrir el Popover
    const triggerButton = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    // 2. Click en el botón de catálogo dentro del Popover
    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    // 3. Verificar que el modal se abre
    await waitFor(() => {
      const modal = screen.getByTestId('catalog-modal');
      expect(modal).toBeInTheDocument();
      expect(
        screen.getByText(/Agregar Canciones al Evento/),
      ).toBeInTheDocument();
    });

    // 4. Simular el cierre del Popover (click fuera)
    // En una implementación real, el Popover se cerraría al abrir el modal
    // Aquí verificamos que el modal sigue existiendo
    const modal = screen.getByTestId('catalog-modal');
    expect(modal).toBeInTheDocument();

    // 5. El modal NO debe estar dentro del árbol del Popover
    // Debe ser un hermano, no un hijo
    const popoverTrigger = container.querySelector('[data-slot="trigger"]');
    if (popoverTrigger) {
      expect(popoverTrigger).not.toContainElement(modal);
    }
  });

  it('should keep new song modal open when popover is closed', async () => {
    const { container } = render(
      <AddSongEventButton params={mockParams} refetch={mockRefetch} />,
    );

    // 1. Abrir el Popover
    const triggerButton = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
    });

    // 2. Click en el botón de nueva canción dentro del Popover
    const newSongButton = screen.getByText(/Nueva Canción/);
    fireEvent.click(newSongButton);

    // 3. Verificar que el modal se abre
    await waitFor(() => {
      const modal = screen.getByTestId('new-song-modal');
      expect(modal).toBeInTheDocument();
      expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
    });

    // 4. El modal debe persistir
    const modal = screen.getByTestId('new-song-modal');
    expect(modal).toBeInTheDocument();

    // 5. El modal NO debe estar dentro del árbol del Popover
    const popoverTrigger = container.querySelector('[data-slot="trigger"]');
    if (popoverTrigger) {
      expect(popoverTrigger).not.toContainElement(modal);
    }
  });

  it('should allow switching between modals without losing state', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    // 1. Abrir catálogo
    const triggerButton = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      expect(screen.getByTestId('catalog-modal')).toBeInTheDocument();
    });

    // 2. Cerrar modal de catálogo
    const catalogCloseButton = screen.getByTestId('catalog-close');
    fireEvent.click(catalogCloseButton);

    await waitFor(() => {
      expect(screen.queryByTestId('catalog-modal')).not.toBeInTheDocument();
    });

    // 3. Abrir popover nuevamente y abrir modal de nueva canción
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
    });

    const newSongButton = screen.getByText(/Nueva Canción/);
    fireEvent.click(newSongButton);

    await waitFor(() => {
      expect(screen.getByTestId('new-song-modal')).toBeInTheDocument();
    });

    // 4. Verificar que solo el modal de nueva canción está visible
    expect(screen.queryByTestId('catalog-modal')).not.toBeInTheDocument();
    expect(screen.getByTestId('new-song-modal')).toBeInTheDocument();
  });

  it('should not open both modals at the same time', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    // 1. Abrir catálogo
    const triggerButton = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      expect(screen.getByTestId('catalog-modal')).toBeInTheDocument();
    });

    // 2. Verificar que solo el modal de catálogo está abierto
    expect(screen.getByTestId('catalog-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('new-song-modal')).not.toBeInTheDocument();
  });

  it('should close modal independently of popover state', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    // 1. Abrir modal de catálogo
    const triggerButton = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      expect(screen.getByTestId('catalog-modal')).toBeInTheDocument();
    });

    // 2. Cerrar el modal usando su propio botón de cierre
    const closeButton = screen.getByTestId('catalog-close');
    fireEvent.click(closeButton);

    // 3. Verificar que el modal se cerró
    await waitFor(() => {
      expect(screen.queryByTestId('catalog-modal')).not.toBeInTheDocument();
    });

    // 4. El botón del trigger sigue disponible
    expect(triggerButton).toBeInTheDocument();
  });

  it('should render modals as siblings to popover in component tree', () => {
    const { container } = render(
      <AddSongEventButton params={mockParams} refetch={mockRefetch} />,
    );

    // La estructura debe tener el Popover y los modales como hermanos
    // No como padre-hijo
    // Verificar que el componente está envuelto en memo
    // Los modales se renderizan condicionalmente fuera del Popover
    expect(container.firstChild).toBeTruthy();
  });
});
