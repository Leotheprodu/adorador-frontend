import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useWebSocketDebounce,
  useLyricMessageDebounce,
  useSongSelectionDebounce,
} from '../useWebSocketDebounce';

describe('useWebSocketDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Basic debounce functionality', () => {
    it('should delay function execution', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.debouncedSend('test-data');
      });

      // Should not call immediately
      expect(mockSend).not.toHaveBeenCalled();

      // Advance timers to trigger debounced function
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(mockSend).toHaveBeenCalledWith('test-data');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should cancel previous call when called multiple times', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.debouncedSend('data-1');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        result.current.debouncedSend('data-2');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        result.current.debouncedSend('data-3');
      });

      // Complete the delay
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should only call with the last data
      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(mockSend).toHaveBeenCalledWith('data-3');
    });

    it('should use most recent data after delay', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 300 }),
      );

      act(() => {
        result.current.debouncedSend({ count: 1 });
        result.current.debouncedSend({ count: 2 });
        result.current.debouncedSend({ count: 3 });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockSend).toHaveBeenCalledWith({ count: 3 });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('maxWait functionality', () => {
    it('should force send after maxWait period', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 1000, maxWait: 2000 }),
      );

      // First call establishes the first call time
      act(() => {
        result.current.debouncedSend('data-1');
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // First call executes
      expect(mockSend).toHaveBeenCalledWith('data-1');
      expect(mockSend).toHaveBeenCalledTimes(1);

      // Send a call that will eventually trigger via maxWait
      act(() => {
        result.current.debouncedSend('data-2');
      });

      // Advance time close to maxWait (2000ms from last send)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Should trigger immediately due to maxWait
      expect(mockSend).toHaveBeenCalledWith('data-2');
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('should use default maxWait of delay * 3', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(
        () => useWebSocketDebounce(mockSend, { delay: 500 }), // maxWait should be 1500
      );

      act(() => {
        result.current.debouncedSend('data-1');
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(mockSend).toHaveBeenCalledTimes(1);

      // Keep sending within maxWait period
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.debouncedSend(`data-${i + 2}`);
        });

        act(() => {
          jest.advanceTimersByTime(400);
        });
      }

      // Should trigger after accumulating more than maxWait
      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockSend).toHaveBeenCalledTimes(2);
    });
  });

  describe('flush functionality', () => {
    it('should immediately send pending data', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 1000 }),
      );

      act(() => {
        result.current.debouncedSend('pending-data');
      });

      // Should not have been called yet
      expect(mockSend).not.toHaveBeenCalled();

      // Flush immediately
      act(() => {
        result.current.flush();
      });

      expect(mockSend).toHaveBeenCalledWith('pending-data');
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should not send if no pending data', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.flush();
      });

      expect(mockSend).not.toHaveBeenCalled();
    });

    it('should clear timeout when flushing', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 1000 }),
      );

      act(() => {
        result.current.debouncedSend('data');
      });

      act(() => {
        result.current.flush();
      });

      // Advance timers - should not call again
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancel functionality', () => {
    it('should cancel pending execution', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.debouncedSend('data-to-cancel');
      });

      act(() => {
        result.current.cancel();
      });

      // Advance timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(mockSend).not.toHaveBeenCalled();
    });

    it('should clear pending data', async () => {
      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.debouncedSend('data');
      });

      act(() => {
        result.current.cancel();
      });

      // Try to flush - should not send anything
      act(() => {
        result.current.flush();
      });

      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Async sendFunction support', () => {
    it('should handle async sendFunction', async () => {
      const mockAsyncSend = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockAsyncSend, { delay: 300 }),
      );

      act(() => {
        result.current.debouncedSend('async-data');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(mockAsyncSend).toHaveBeenCalledWith('async-data');
      });
    });

    it('should handle async sendFunction errors gracefully', async () => {
      const mockAsyncSend = jest
        .fn()
        .mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockAsyncSend, { delay: 300 }),
      );

      act(() => {
        result.current.debouncedSend('error-data');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          '[Debounce] Send error:',
          expect.any(Error),
        );
      });
    });

    it('should handle flush errors for async functions', async () => {
      const mockAsyncSend = jest
        .fn()
        .mockRejectedValue(new Error('Flush error'));
      const { result } = renderHook(() =>
        useWebSocketDebounce(mockAsyncSend, { delay: 300 }),
      );

      act(() => {
        result.current.debouncedSend('data');
      });

      act(() => {
        result.current.flush();
      });

      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          '[Debounce] Flush error:',
          expect.any(Error),
        );
      });
    });
  });

  describe('Cleanup on unmount', () => {
    it('should clear timeout on unmount', async () => {
      const mockSend = jest.fn();
      const { result, unmount } = renderHook(() =>
        useWebSocketDebounce(mockSend, { delay: 500 }),
      );

      act(() => {
        result.current.debouncedSend('data');
      });

      unmount();

      // Advance timers after unmount
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Should not call after unmount
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Type safety with generics', () => {
    it('should work with different data types', async () => {
      interface CustomData {
        id: number;
        message: string;
      }

      const mockSend = jest.fn();
      const { result } = renderHook(() =>
        useWebSocketDebounce<CustomData>(mockSend, { delay: 300 }),
      );

      const testData: CustomData = { id: 1, message: 'test' };

      act(() => {
        result.current.debouncedSend(testData);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(mockSend).toHaveBeenCalledWith(testData);
    });
  });
});

describe('useLyricMessageDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should use 200ms delay', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useLyricMessageDebounce(mockSend));

    act(() => {
      result.current.sendLyricMessage({ lyricId: 1 });
    });

    act(() => {
      jest.advanceTimersByTime(199);
    });

    expect(mockSend).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockSend).toHaveBeenCalledWith({ lyricId: 1 });
  });

  it('should use 500ms maxWait', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useLyricMessageDebounce(mockSend));

    act(() => {
      result.current.sendLyricMessage({ lyricId: 1 });
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockSend).toHaveBeenCalledTimes(1);

    // Send another message and wait for maxWait period
    act(() => {
      result.current.sendLyricMessage({ lyricId: 2 });
    });

    // Advance time to trigger maxWait (500ms from last send)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should have forced send due to maxWait
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenLastCalledWith({ lyricId: 2 });
  });

  it('should expose flush and cancel methods', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useLyricMessageDebounce(mockSend));

    expect(result.current.flush).toBeDefined();
    expect(result.current.cancel).toBeDefined();

    act(() => {
      result.current.sendLyricMessage({ lyricId: 1 });
    });

    act(() => {
      result.current.flush();
    });

    expect(mockSend).toHaveBeenCalledWith({ lyricId: 1 });
  });
});

describe('useSongSelectionDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should use 300ms delay', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useSongSelectionDebounce(mockSend));

    act(() => {
      result.current.sendSongSelection(42);
    });

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(mockSend).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockSend).toHaveBeenCalledWith(42);
  });

  it('should use 800ms maxWait', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useSongSelectionDebounce(mockSend));

    act(() => {
      result.current.sendSongSelection(1);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockSend).toHaveBeenCalledTimes(1);

    // Send another selection and wait for maxWait period
    act(() => {
      result.current.sendSongSelection(2);
    });

    // Advance time to trigger maxWait (800ms from last send)
    act(() => {
      jest.advanceTimersByTime(800);
    });

    // Should have forced send due to maxWait (800ms)
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockSend).toHaveBeenLastCalledWith(2);
  });

  it('should handle rapid song changes', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useSongSelectionDebounce(mockSend));

    // Simulate rapid song selection changes
    act(() => {
      result.current.sendSongSelection(1);
      result.current.sendSongSelection(2);
      result.current.sendSongSelection(3);
      result.current.sendSongSelection(4);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should only send the last selection
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(4);
  });

  it('should expose flush and cancel methods', async () => {
    const mockSend = jest.fn();
    const { result } = renderHook(() => useSongSelectionDebounce(mockSend));

    expect(result.current.flush).toBeDefined();
    expect(result.current.cancel).toBeDefined();

    act(() => {
      result.current.sendSongSelection(99);
    });

    act(() => {
      result.current.cancel();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockSend).not.toHaveBeenCalled();
  });
});
