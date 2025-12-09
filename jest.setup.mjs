// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock global de NextUI (evita errores ESM en todos los tests)
jest.mock('@heroui/react', () => {
  const React = require('react');
  return {
    __esModule: true,
    Card: ({ children }) => <div data-testid="Card">{children}</div>,
    CardBody: ({ children }) => <div data-testid="CardBody">{children}</div>,
    CardHeader: ({ children }) => (
      <div data-testid="CardHeader">{children}</div>
    ),
    CardFooter: ({ children }) => (
      <div data-testid="CardFooter">{children}</div>
    ),
    Avatar: ({ children }) => <div data-testid="Avatar">{children}</div>,
    Button: ({ children, onPress, ...props }) => (
      <button onClick={onPress} {...props}>
        {children}
      </button>
    ),
    Textarea: ({ value, onValueChange, ...props }) => (
      <textarea
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        {...props}
      />
    ),
    Spinner: () => <div data-testid="Spinner">Loading...</div>,
    Chip: ({ children }) => <div data-testid="Chip">{children}</div>,
    Tooltip: ({ children }) => <div data-testid="Tooltip">{children}</div>,
    Popover: ({ children }) => <div data-testid="Popover">{children}</div>,
    Tab: ({ children }) => <div data-testid="Tab">{children}</div>,
    Tabs: ({ children }) => <div data-testid="Tabs">{children}</div>,
    // Mock global de useDisclosure para todos los tests
    useDisclosure: () => ({
      isOpen: false,
      onOpen: jest.fn(),
      onOpenChange: jest.fn(),
      onClose: jest.fn(),
    }),
    // Agrega aquí más mocks si aparecen errores de otros componentes de NextUI
  };
});

// Mock global de nanostores y @nanostores/react
jest.mock('nanostores', () => ({
  atom: (init) => ({ get: () => init, set: () => {} }),
  map: () => ({}),
  computed: () => ({}),
}));
jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({})),
}));
