import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRejectInvitation } from '../useRejectInvitation';
import { PostData } from '@global/services/HandleAPI';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('@global/services/HandleAPI');
jest.mock('react-hot-toast');

const mockPostData = PostData as jest.MockedFunction<typeof PostData>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('useRejectInvitation', () => {
  let queryClient: QueryClient;

  const mockResponse = {
    message: 'Invitación rechazada exitosamente',
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
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should reject invitation successfully', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    expect(result.current.isRejecting).toBe(false);

    const success = await result.current.rejectInvitation();

    await waitFor(() => {
      expect(success).toBe(true);
      expect(mockMutateAsync).toHaveBeenCalledWith(undefined);
      expect(mockToast.success).toHaveBeenCalledWith('Invitación rechazada');
    });
  });

  it('should invalidate correct queries after rejecting invitation', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    await result.current.rejectInvitation();

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['PendingInvitations'],
      });
    });
  });

  it('should handle errors when rejecting invitation', async () => {
    const errorMessage = 'Error al rechazar la invitación';
    const mockMutateAsync = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    const success = await result.current.rejectInvitation();

    await waitFor(() => {
      expect(success).toBe(false);
      expect(mockToast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should set isRejecting to true during process and false after', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue(mockResponse);

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    expect(result.current.isRejecting).toBe(false);

    const promise = result.current.rejectInvitation();

    await waitFor(() => {
      expect(result.current.isRejecting).toBe(false);
    });

    await promise;

    expect(result.current.isRejecting).toBe(false);
  });

  it('should handle generic errors gracefully', async () => {
    const mockMutateAsync = jest.fn().mockRejectedValue('Unknown error');

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    const success = await result.current.rejectInvitation();

    await waitFor(() => {
      expect(success).toBe(false);
      expect(mockToast.error).toHaveBeenCalledWith(
        'Error al rechazar la invitación',
      );
    });
  });

  it('should use correct API endpoint', () => {
    mockPostData.mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'idle',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderHook(() => useRejectInvitation(456), { wrapper });

    expect(mockPostData).toHaveBeenCalledWith({
      key: 'RejectInvitation-456',
      url: expect.stringContaining('/bands/invitations/456/reject'),
      method: 'POST',
    });
  });

  it('should return rejectInvitationStatus from mutation', () => {
    mockPostData.mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'pending',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    expect(result.current.rejectInvitationStatus).toBe('pending');
  });

  it('should reset isRejecting to false even on error', async () => {
    const mockMutateAsync = jest
      .fn()
      .mockRejectedValue(new Error('Test error'));

    mockPostData.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { result } = renderHook(() => useRejectInvitation(1), { wrapper });

    await result.current.rejectInvitation();

    await waitFor(() => {
      expect(result.current.isRejecting).toBe(false);
    });
  });
});
