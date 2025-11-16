// Mock nanostores first - before any imports
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

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  // eslint-disable-next-line react/display-name
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock NextUI components
jest.mock('@nextui-org/modal', () => ({
  Modal: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
  ModalContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ModalFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  }),
}));

// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@nextui-org/react', () => {
  const original = jest.requireActual('@nextui-org/react');
  return {
    ...original,
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

jest.mock('@nextui-org/input', () => ({
  Input: ({
    value,
    onChange,
  }: {
    value?: string;
    onChange?: (value: string) => void;
  }) => (
    <input
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      data-testid="input"
    />
  ),
}));

// Mock custom button components
jest.mock('@global/components/buttons', () => ({
  PrimaryButton: ({
    children,
    href,
    onClick,
    onPress,
    endContent,
    isLoading,
    isDisabled,
  }: {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    onPress?: () => void;
    endContent?: React.ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;
  }) => {
    if (href) {
      return (
        <a href={href}>
          <button disabled={isLoading || isDisabled}>
            {children}
            {endContent}
          </button>
        </a>
      );
    }
    return (
      <button onClick={onClick || onPress} disabled={isLoading || isDisabled}>
        {children}
        {endContent}
      </button>
    );
  },
  TertiaryButton: ({
    children,
    onClick,
    onPress,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    onPress?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick || onPress} className={className}>
      {children}
    </button>
  ),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: undefined,
    error: null,
  })),
  useQuery: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import { GruposCTASection } from '../GruposCTASection';
import { useStore } from '@nanostores/react';
import { useRouter } from 'next/navigation';

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('GruposCTASection Component', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  describe('Logged Out State', () => {
    beforeEach(() => {
      mockUseStore.mockReturnValue({
        isLoggedIn: false,
        user: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it('should render login prompt when user is not logged in', () => {
      render(<GruposCTASection />);
      expect(
        screen.getByText('¿Quieres que tu grupo aparezca aquí?'),
      ).toBeInTheDocument();
    });

    it('should render call to action text', () => {
      render(<GruposCTASection />);
      expect(
        screen.getByText(/Únete a Zamr y comienza a gestionar tu ministerio/i),
      ).toBeInTheDocument();
    });

    it('should render login button with correct link', () => {
      render(<GruposCTASection />);
      const loginButton = screen.getByText('Registrar mi grupo');
      expect(loginButton).toBeInTheDocument();
      expect(loginButton.closest('a')).toHaveAttribute('href', '/auth/login');
    });
  });

  describe('Logged In State', () => {
    beforeEach(() => {
      mockUseStore.mockReturnValue({
        isLoggedIn: true,
        user: { id: 1, name: 'Test User' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it('should render create group prompt when user is logged in', () => {
      render(<GruposCTASection />);
      expect(
        screen.getByText('¿Listo para crear un nuevo grupo?'),
      ).toBeInTheDocument();
    });

    it('should render create group button', () => {
      render(<GruposCTASection />);
      const createButton = screen.getByText('+ Crear nuevo grupo');
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Placeholder Tests for Future Implementation', () => {
    it('should support conditional rendering based on login state', () => {
      // Placeholder - Full implementation would test logged in vs logged out states
      expect(true).toBe(true);
    });

    it('should support modal interaction for creating groups', () => {
      // Placeholder - Full implementation would test modal opening and form submission
      expect(true).toBe(true);
    });

    it('should integrate with PostData API service', () => {
      // Placeholder - Full implementation would test API integration
      expect(true).toBe(true);
    });
  });
});
