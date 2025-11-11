import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInviteUser, useSearchUsers } from '../useInviteUser';
import { PostData } from '@global/services/HandleAPI';
import { getTokens } from '@global/utils/jwtUtils';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@global/services/HandleAPI');
jest.mock('@global/utils/jwtUtils');
jest.mock('react-hot-toast');

const mockPostData = PostData as jest.MockedFunction<typeof PostData>;
const mockGetTokens = getTokens as jest.MockedFunction<typeof getTokens>;
const mockToast = toast as jest.Mocked<typeof toast>;

// Mock global fetch
global.fetch = jest.fn();

describe('useSearchUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToast.error = jest.fn();
    mockGetTokens.mockReturnValue({
      accessToken: 'test-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 3600000,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should search users successfully', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        hasPendingInvitation: false,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '0987654321',
        hasPendingInvitation: true,
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const { result } = renderHook(() => useSearchUsers(100));

    expect(result.current.searchResults).toEqual([]);

    await result.current.searchUsers('John');

    await waitFor(() => {
      expect(result.current.searchResults).toEqual(mockUsers);
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should not search with query less than 2 characters', async () => {
    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('J');

    expect(mockToast.error).toHaveBeenCalledWith(
      'Escribe al menos 2 caracteres',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should not search with empty query', async () => {
    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('  ');

    expect(mockToast.error).toHaveBeenCalledWith(
      'Escribe al menos 2 caracteres',
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle search errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error en la búsqueda' }),
    });

    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('John');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Error en la búsqueda');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('John');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network error');
      expect(result.current.searchResults).toEqual([]);
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should handle missing authentication token', async () => {
    mockGetTokens.mockReturnValue(null);

    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('John');

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('No estás autenticado');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('should clear search results', async () => {
    const { result } = renderHook(() => useSearchUsers(100));

    // First do a search to have results
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'Test',
          email: 'test@test.com',
          phone: '123',
          hasPendingInvitation: false,
        },
      ],
    });

    await result.current.searchUsers('Test');

    await waitFor(() => {
      expect(result.current.searchResults).toHaveLength(1);
    });

    result.current.clearResults();

    await waitFor(() => {
      expect(result.current.searchResults).toEqual([]);
    });
  });

  it('should set isSearching to true during search', async () => {
    let resolveSearch: (value: unknown) => void;
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve;
    });

    (global.fetch as jest.Mock).mockImplementationOnce(
      () => searchPromise.then(() => ({ ok: true, json: async () => [] })),
    );

    const { result } = renderHook(() => useSearchUsers(100));

    const search = result.current.searchUsers('John');

    // Should be searching
    await waitFor(() => {
      expect(result.current.isSearching).toBe(true);
    });

    // Resolve the search
    resolveSearch!(null);
    await search;

    // Should stop searching after completion
    await waitFor(() => {
      expect(result.current.isSearching).toBe(false);
    });
  });

  it('should use correct API endpoint with encoded query', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useSearchUsers(100));

    await result.current.searchUsers('John Doe');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/bands/100/search-users?q=John%20Doe'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });
});

describe('useInviteUser', () => {
  let queryClient: QueryClient;

  const mockInviteResponse = { id: 1 };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should invite user successfully', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockInviteResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    expect(result.current.isInviting).toBe(false);

    const success = await result.current.inviteUser(50);

    await waitFor(() => {
      expect(success).toBe(true);
      expect(mockMutateAsync).toHaveBeenCalledWith({ invitedUserId: 50 });
      expect(mockToast.success).toHaveBeenCalledWith(
        'Invitación enviada exitosamente',
      );
    });
  });

  it('should invalidate search query after inviting user', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockInviteResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    await result.current.inviteUser(50);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['SearchUsers-100'],
      });
    });
  });

  it('should handle errors when inviting user', async () => {
    const errorMessage = 'Usuario ya tiene invitación pendiente';
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error(errorMessage));

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    const success = await result.current.inviteUser(50);

    await waitFor(() => {
      expect(success).toBe(false);
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should handle generic errors gracefully', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue('Unknown error');

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    const success = await result.current.inviteUser(50);

    await waitFor(() => {
      expect(success).toBe(false);
      expect(mockToast.error).toHaveBeenCalledWith(
        'Error al enviar la invitación',
      );
    });
  });

  it('should set isInviting to true during process and false after', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockInviteResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    expect(result.current.isInviting).toBe(false);

    const promise = result.current.inviteUser(50);

    await waitFor(() => {
      expect(result.current.isInviting).toBe(false);
    });

    await promise;

    expect(result.current.isInviting).toBe(false);
  });

  it('should use correct API endpoint', () => {
    mockPostData.mockReturnValue({
      mutateAsync: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderHook(() => useInviteUser(200), { wrapper });

    expect(mockPostData).toHaveBeenCalledWith({
      key: 'InviteUser-200',
      url: expect.stringContaining('/bands/200/invite'),
      method: 'POST',
    });
  });

  it('should reset isInviting to false even on error', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Test error'));

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useInviteUser(100), { wrapper });

    await result.current.inviteUser(50);

    await waitFor(() => {
      expect(result.current.isInviting).toBe(false);
    });
  });
});
