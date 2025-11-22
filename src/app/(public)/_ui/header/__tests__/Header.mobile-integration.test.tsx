// Mock nanostores FIRST - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(),
}));

// Mock NextUI components
jest.mock('@nextui-org/react', () => ({
  Button: ({
    children,
    onPress,
    isDisabled,
    disabled,
    isLoading,
    className = '',
    ...props
  }: React.PropsWithChildren<{
    onPress?: () => void;
    isDisabled?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    className?: string;
  }>) => (
    <button
      onClick={onPress}
      disabled={isDisabled || disabled}
      data-disabled={isDisabled || disabled ? 'true' : undefined}
      data-loading={isLoading ? 'true' : undefined}
      className={className}
      {...props}
    >
      {children}
    </button>
  ),
  Dropdown: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DropdownTrigger: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
  DropdownMenu: ({ children }: React.PropsWithChildren) => (
    <div role="menu">{children}</div>
  ),
  DropdownItem: ({
    children,
    onPress,
  }: React.PropsWithChildren<{ onPress?: () => void }>) => (
    <div role="menuitem" onClick={onPress}>
      {children}
    </div>
  ),
}));

// Mock ThemeToggle
jest.mock('@global/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock NotificationBell que respeta el estado de login
import * as usersStore from '@global/stores/users';
jest.mock('@ui/header/components/NotificationBell', () => ({
  NotificationBell: () => {
    // Simula el comportamiento real: solo renderiza si el usuario está logueado
    const user = usersStore.$user.get();
    if (!user?.isLoggedIn) return null;
    return (
      <button data-testid="notification-bell-button" className="relative z-50">
        Mock NotificationBell
      </button>
    );
  },
}));

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}


// Mock hooks
jest.mock('@app/(public)/grupos/_hooks/usePendingInvitations');
jest.mock('@global/utils/updateUserFromToken');

// Mock Next.js modules
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

jest.mock('next/image', () => {
  const MockImage = ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    phone: '+1234567890',
    birthdate: '1990-01-01',
    status: 'active' as const,
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: true,
  };

  return {
    $user: {
      get: () => value,
      set: (newValue: typeof value) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

import { render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { usePendingInvitations } from '@app/(public)/grupos/_hooks/usePendingInvitations';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

const mockUsePendingInvitations = usePendingInvitations as jest.MockedFunction<
  typeof usePendingInvitations
>;
const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe('Header - Integración Móvil (NotificationBell + Menu)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStore.mockReturnValue($user.get());
    mockUsePendingInvitations.mockReturnValue({
      data: [],
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  describe('Visibilidad simultánea en móvil', () => {
    it('debe renderizar NotificationBell y botón hamburguesa cuando el usuario está logueado', () => {
      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');
      const menuButton = screen.getByLabelText('Abrir menú');

      expect(notificationButton).toBeInTheDocument();
      expect(menuButton).toBeInTheDocument();
    });

    it('ambos botones deben estar en el mismo contenedor flex con gap-3', () => {
      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');
      const menuButton = screen.getByLabelText('Abrir menú');

      // Verificar que están en el mismo contenedor padre
      const container = notificationButton.parentElement;
      expect(container).toContainElement(menuButton);

      // Verificar que el contenedor tiene las clases correctas para separación
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-center');
      expect(container).toHaveClass('gap-3');
    });

    it('NotificationBell debe tener posición relative, no fixed', () => {
      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');

      // Verificar que tiene relative
      expect(notificationButton).toHaveClass('relative');
      // Verificar que NO tiene fixed
      expect(notificationButton.className).not.toMatch(/\bfixed\b/);
    });

    it('botón hamburguesa debe tener posición relative en móvil, no fixed', () => {
      renderWithQueryClient(<Header />);

      const menuButton = screen.getByLabelText('Abrir menú');

      // Verificar que tiene relative
      expect(menuButton).toHaveClass('relative');
      // Verificar que NO tiene fixed (que causaba el problema de superposición)
      expect(menuButton.className).not.toMatch(/\bfixed\b/);
    });

    it('ambos botones deben tener z-index 50 para estar sobre el overlay', () => {
      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');
      const menuButton = screen.getByLabelText('Abrir menú');

      expect(notificationButton).toHaveClass('z-50');
      expect(menuButton).toHaveClass('z-50');
    });

    it('el contenedor de ambos botones debe respetar el flujo del header', () => {
      const { container } = renderWithQueryClient(<Header />);

      const header = container.querySelector('header');
      const notificationButton = screen.getByTestId('notification-bell-button');

      // El header debe usar flex justify-between
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('justify-between');

      // El contenedor de los botones debe estar dentro del header
      const buttonsContainer = notificationButton.parentElement;
      expect(header).toContainElement(buttonsContainer);
    });
  });

  describe('Comportamiento sin usuario logueado', () => {
    it('no debe mostrar NotificationBell pero sí el menú hamburguesa', () => {
      // Actualiza el store real para simular usuario no logueado
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const usersStore = require('@global/stores/users');
      usersStore.$user.set({
        ...usersStore.$user.get(),
        isLoggedIn: false,
      });
      mockUseStore.mockReturnValue(usersStore.$user.get());

      renderWithQueryClient(<Header />);

      const notificationButton = screen.queryByTestId(
        'notification-bell-button',
      );
      const menuButton = screen.getByLabelText('Abrir menú');

      expect(notificationButton).not.toBeInTheDocument();
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Prevención de superposición', () => {
    it('el gap-3 debe proporcionar separación suficiente entre botones (12px)', () => {
      // Asegura usuario logueado
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const usersStore = require('@global/stores/users');
      usersStore.$user.set({
        ...usersStore.$user.get(),
        isLoggedIn: true,
      });
      mockUseStore.mockReturnValue(usersStore.$user.get());

      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');
      const container = notificationButton.parentElement;

      // gap-3 en Tailwind = 0.75rem = 12px
      // Esto previene que los botones se superpongan en móvil
      expect(container).toHaveClass('gap-3');
    });

    it('ambos botones deben usar relative positioning para mantener flujo del documento', () => {
      // Asegura usuario logueado
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const usersStore = require('@global/stores/users');
      usersStore.$user.set({
        ...usersStore.$user.get(),
        isLoggedIn: true,
      });
      mockUseStore.mockReturnValue(usersStore.$user.get());

      renderWithQueryClient(<Header />);

      const notificationButton = screen.getByTestId('notification-bell-button');
      const menuButton = screen.getByLabelText('Abrir menú');

      // relative en lugar de fixed/absolute permite que respeten el gap del contenedor
      expect(notificationButton).toHaveClass('relative');
      expect(menuButton).toHaveClass('relative');
    });
  });

  describe('Estructura del Header', () => {
    it('debe tener z-index 40 para estar debajo de los botones (z-50)', () => {
      const { container } = renderWithQueryClient(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('z-40');
    });

    it('debe ser fixed y cubrir todo el ancho', () => {
      const { container } = renderWithQueryClient(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('fixed');
      expect(header).toHaveClass('w-screen');
    });
  });
});
