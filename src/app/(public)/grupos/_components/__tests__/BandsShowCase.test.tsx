/**
 * Tests para BandsShowCase - Componente que muestra todas las bandas del usuario
 */

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

// Mock NextUI components
jest.mock('@nextui-org/react', () => ({
  Card: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardBody: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  CardFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Button: ({
    children,
    onPress,
    ...props
  }: React.PropsWithChildren<{ onPress?: () => void }>) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
  Chip: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  Spinner: () => <div aria-label="Loading">Loading...</div>,
}));

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
    email: 'test@test.com',
    phone: '+1234567890',
    roles: [1],
    membersofBands: [
      {
        id: 1,
        role: 'Admin',
        isAdmin: true,
        isEventManager: false,
        band: {
          id: 1,
          name: 'Test Band',
        },
      },
    ],
  };

  return {
    $user: {
      get: () => value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BandsShowCase } from '../BandsShowCase';
import { getBandsOfUser } from '@bands/_services/bandsService';
import { useStore } from '@nanostores/react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';

// Helper para envolver en QueryClientProvider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return {
    ...render(ui, { wrapper }),
    queryClient,
    wrapper,
  };
};

// Mock del servicio de bandas
jest.mock('@bands/_services/bandsService', () => ({
  getBandsOfUser: jest.fn(),
}));

// Mock de los componentes
jest.mock('../BandCard', () => ({
  BandCard: ({ band }: { band: { id: number; name: string } }) => (
    <div data-testid={`band-card-${band.id}`}>{band.name}</div>
  ),
}));

jest.mock('../SkeletonBandCard', () => ({
  SkeletonBandCard: () => <div data-testid="skeleton-card">Loading...</div>,
}));

const mockGetBandsOfUser = getBandsOfUser as jest.MockedFunction<
  typeof getBandsOfUser
>;
const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe('BandsShowCase', () => {
  const mockBands = [
    {
      id: 1,
      name: 'Grupo de Alabanza 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      churchId: 1,
      _count: {
        events: 5,
        songs: 20,
        members: 10,
      },
      events: [],
    },
    {
      id: 2,
      name: 'Grupo de Alabanza 2',
      createdAt: new Date(),
      updatedAt: new Date(),
      churchId: 1,
      _count: {
        events: 3,
        songs: 15,
        members: 8,
      },
      events: [],
    },
    {
      id: 3,
      name: 'Grupo de Adoración',
      createdAt: new Date(),
      updatedAt: new Date(),
      churchId: 1,
      _count: {
        events: 2,
        songs: 10,
        members: 5,
      },
      events: [],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStore.mockReturnValue({
      id: 1,
      name: 'Test User',
      isLoggedIn: true,
      email: 'test@test.com',
      phone: '+1234567890',
      roles: [1],
      membersofBands: [],
    });
  });

  describe('Estado de carga', () => {
    test('debe mostrar skeletons mientras carga', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const skeletons = screen.getAllByTestId('skeleton-card');
      expect(skeletons).toHaveLength(3);
    });

    test('debe mostrar mensaje "Loading..." en cada skeleton', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const loadingTexts = screen.getAllByText('Loading...');
      expect(loadingTexts).toHaveLength(3);
    });
  });

  describe('Estado de error', () => {
    test('debe mostrar mensaje cuando no está en ningún grupo', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: new Error('No bands found'),
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(
        screen.getByText('Aún no estas en un grupo de alabanza'),
      ).toBeInTheDocument();
    });

    test('NO debe mostrar skeletons cuando hay error', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: new Error('No bands found'),
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
    });
  });

  describe('Renderizado de bandas', () => {
    test('debe renderizar todas las bandas del usuario', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      expect(screen.getByTestId('band-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('band-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('band-card-3')).toBeInTheDocument();
    });

    test('debe mostrar los nombres de las bandas', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      expect(screen.getByText('Grupo de Alabanza 1')).toBeInTheDocument();
      expect(screen.getByText('Grupo de Alabanza 2')).toBeInTheDocument();
      expect(screen.getByText('Grupo de Adoración')).toBeInTheDocument();
    });

    test('debe renderizar la cantidad correcta de BandCards', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const bandCards = container.querySelectorAll(
        '[data-testid^="band-card-"]',
      );
      expect(bandCards).toHaveLength(3);
    });

    test('debe usar lista (<ul>) para accesibilidad', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const list = container.querySelector('ul');
      expect(list).toBeInTheDocument();
    });

    test('cada banda debe estar en un <li>', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
    });
  });

  describe('Estado vacío', () => {
    test('NO debe mostrar nada cuando data es array vacío', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: [],
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      expect(screen.queryByTestId('band-card-1')).not.toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('li')).not.toBeInTheDocument();
    });
  });

  describe('Integración con el store de usuario', () => {
    test('debe llamar a getBandsOfUser con isLoggedIn = true cuando el usuario está logueado', () => {
      mockUseStore.mockReturnValue({
        id: 1,
        name: 'Test User',
        isLoggedIn: true,
        email: 'test@test.com',
        phone: '+1234567890',
        roles: [1],
        membersofBands: [],
      });

      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(mockGetBandsOfUser).toHaveBeenCalledWith(true);
    });

    test('debe llamar a getBandsOfUser con isLoggedIn = false cuando el usuario NO está logueado', () => {
      mockUseStore.mockReturnValue({
        id: 0,
        name: '',
        isLoggedIn: false,
        email: '',
        phone: '',
        roles: [],
        membersofBands: [],
      });

      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: new Error('Not logged in'),
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(mockGetBandsOfUser).toHaveBeenCalledWith(false);
    });
  });

  describe('Estilos y layout', () => {
    test('debe aplicar flex-wrap para diseño responsive', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const list = container.querySelector('ul');
      expect(list).toHaveClass('flex', 'flex-wrap');
    });

    test('debe aplicar gap entre las cards', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const list = container.querySelector('ul');
      expect(list).toHaveClass('gap-3');
    });

    test('debe tener height full en el contenedor principal', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass('h-full');
    });
  });

  describe('Transiciones de estado', () => {
    test('debe cambiar de loading a mostrar bandas correctamente', async () => {
      // Primero loading
      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: null,
        isLoading: true,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { rerender, wrapper } = renderWithQueryClient(<BandsShowCase />);
      expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);

      // Luego datos cargados
      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      rerender(<BandsShowCase />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId('skeleton-card')).not.toBeInTheDocument();
        expect(screen.getByTestId('band-card-1')).toBeInTheDocument();
      });
    });

    test('debe manejar cambio de usuario no logueado a logueado', async () => {
      // Usuario no logueado
      mockUseStore.mockReturnValue({
        id: 0,
        name: '',
        isLoggedIn: false,
        email: '',
        phone: '',
        roles: [],
        membersofBands: [],
      });

      mockGetBandsOfUser.mockReturnValue({
        data: undefined,
        error: new Error('Not logged in'),
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { rerender, wrapper } = renderWithQueryClient(<BandsShowCase />);
      expect(
        screen.getByText('Aún no estas en un grupo de alabanza'),
      ).toBeInTheDocument();

      // Usuario se loguea
      mockUseStore.mockReturnValue({
        id: 1,
        name: 'Test User',
        isLoggedIn: true,
        email: 'test@test.com',
        phone: '+1234567890',
        roles: [1],
        membersofBands: [],
      });

      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      rerender(<BandsShowCase />, { wrapper });

      await waitFor(() => {
        expect(
          screen.queryByText('Aún no estas en un grupo de alabanza'),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId('band-card-1')).toBeInTheDocument();
      });
    });
  });

  describe('Casos extremos', () => {
    test('debe manejar una sola banda correctamente', () => {
      mockGetBandsOfUser.mockReturnValue({
        data: [mockBands[0]],
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(screen.getByTestId('band-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('band-card-2')).not.toBeInTheDocument();
    });

    test('debe manejar muchas bandas (renderizado masivo)', () => {
      const manyBands = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Banda ${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        churchId: 1,
        _count: {
          events: 5,
          songs: 20,
          members: 10,
        },
        events: [],
      }));

      mockGetBandsOfUser.mockReturnValue({
        data: manyBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      const { container } = renderWithQueryClient(<BandsShowCase />);

      const bandCards = container.querySelectorAll(
        '[data-testid^="band-card-"]',
      );
      expect(bandCards).toHaveLength(20);
    });
  });

  describe('Memoización', () => {
    test('debe usar useMemo para isLoggedIn para evitar re-renders innecesarios', () => {
      // Este test verifica que el componente está optimizado
      // aunque no podemos verificar directamente el useMemo,
      // podemos verificar que se comporta correctamente

      mockUseStore.mockReturnValue({
        id: 1,
        name: 'Test User',
        isLoggedIn: true,
        email: 'test@test.com',
        phone: '+1234567890',
        roles: [1],
        membersofBands: [],
      });

      mockGetBandsOfUser.mockReturnValue({
        data: mockBands,
        error: null,
        isLoading: false,
      } as unknown as UseQueryResult<BandsWithMembersCount[], Error>);

      renderWithQueryClient(<BandsShowCase />);

      expect(mockGetBandsOfUser).toHaveBeenCalledTimes(1);
      expect(mockGetBandsOfUser).toHaveBeenCalledWith(true);
    });
  });
});
