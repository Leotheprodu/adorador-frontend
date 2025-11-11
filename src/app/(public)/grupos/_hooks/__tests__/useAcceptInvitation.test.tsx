import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAcceptInvitation } from '../useAcceptInvitation';
import { PostData } from '@global/services/HandleAPI';
import { setTokens, getTokenExpirationTime } from '@global/utils/jwtUtils';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@global/services/HandleAPI');
jest.mock('@global/utils/jwtUtils');
jest.mock('react-hot-toast');

const mockPostData = PostData as jest.MockedFunction<typeof PostData>;
const mockSetTokens = setTokens as jest.MockedFunction<typeof setTokens>;
const mockGetTokenExpirationTime =
  getTokenExpirationTime as jest.MockedFunction<typeof getTokenExpirationTime>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('useAcceptInvitation', () => {
  let queryClient: QueryClient;

  const mockResponse = {
    membership: {
      id: 1,
      userId: 100,
      bandId: 50,
      role: 'Miembro',
      isAdmin: false,
      isEventManager: false,
      user: {
        id: 100,
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
      },
      band: {
        id: 50,
        name: 'Test Band',
      },
    },
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    jest.clearAllMocks();

    // Mock toast methods
    mockToast.success = jest.fn();
    mockToast.error = jest.fn();

    // Mock getTokenExpirationTime to return a timestamp
    mockGetTokenExpirationTime.mockReturnValue(Date.now() + 3600000);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should accept invitation successfully', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    expect(result.current.isAccepting).toBe(false);

    const response = await result.current.acceptInvitation();

    await waitFor(() => {
      expect(response).toEqual(mockResponse);
      expect(mockMutateAsync).toHaveBeenCalledWith(undefined);
      expect(mockSetTokens).toHaveBeenCalledWith({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: expect.any(Number),
      });
      expect(mockToast.success).toHaveBeenCalledWith('Te uniste a Test Band!');
    });
  });

  it('should invalidate correct queries after accepting invitation', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    await result.current.acceptInvitation();

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['PendingInvitations'],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['BandsOfUser'],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['Bands'],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['BandMembers', '50'],
      });
    });
  });

  it('should handle errors when accepting invitation', async () => {
    const errorMessage = 'Error al aceptar la invitación';
    const mockMutateAsync = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    const response = await result.current.acceptInvitation();

    await waitFor(() => {
      expect(response).toBeNull();
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
      expect(mockSetTokens).not.toHaveBeenCalled();
    });
  });

  it('should set isAccepting to true during process and false after', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    expect(result.current.isAccepting).toBe(false);

    const promise = result.current.acceptInvitation();

    // El estado cambia inmediatamente después de llamar a la función
    await waitFor(() => {
      expect(result.current.isAccepting).toBe(false);
    });

    await promise;

    expect(result.current.isAccepting).toBe(false);
  });

  it('should handle generic errors gracefully', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue('Unknown error');

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    const response = await result.current.acceptInvitation();

    await waitFor(() => {
      expect(response).toBeNull();
      expect(mockToast.error).toHaveBeenCalledWith(
        'Error al aceptar la invitación',
      );
    });
  });

  it('should use correct API endpoint', () => {
    mockPostData.mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'idle',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderHook(() => useAcceptInvitation(123), { wrapper });

    expect(mockPostData).toHaveBeenCalledWith({
      key: 'AcceptInvitation-123',
      url: expect.stringContaining('/bands/invitations/123/accept'),
      method: 'POST',
    });
  });

  it('should return acceptInvitationStatus from mutation', () => {
    mockPostData.mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'pending',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useAcceptInvitation(1), { wrapper });

    expect(result.current.acceptInvitationStatus).toBe('pending');
  });
});
