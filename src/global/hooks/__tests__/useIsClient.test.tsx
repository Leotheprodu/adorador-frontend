import { renderHook, waitFor } from '@testing-library/react';
import { useIsClient } from '../useIsClient';

describe('useIsClient Hook', () => {
  it('should eventually return true after mount', async () => {
    const { result } = renderHook(() => useIsClient());

    // El hook usa useEffect, que se ejecuta después del render inicial
    // En el entorno de test, el efecto se ejecuta inmediatamente
    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should maintain true value on rerender', async () => {
    const { result, rerender } = renderHook(() => useIsClient());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    // Después de re-renderizar, debería seguir siendo true
    rerender();
    expect(result.current).toBe(true);
  });
});
