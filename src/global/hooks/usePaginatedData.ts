import { useState, useEffect } from 'react';
import { FetchData } from '@global/services/HandleAPI';

/**
 * Interfaz base para respuestas paginadas
 */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: number | string | null;
  hasMore: boolean;
}

/**
 * Configuración del hook de paginación
 */
interface UsePaginatedDataConfig<TParams = Record<string, unknown>> {
  /** URL base para la consulta */
  baseUrl: string;
  /** Clave base para React Query */
  queryKey: string[];
  /** Parámetros adicionales para la consulta */
  params?: TParams;
  /** Límite de elementos por página */
  limit?: number;
  /** Si la consulta está habilitada */
  isEnabled?: boolean;
  /** Si debe refetch al montar */
  refetchOnMount?: boolean;
  /** Función para construir la URL con parámetros */
  buildUrl?: (
    baseUrl: string,
    cursor?: number | string,
    limit?: number,
    params?: TParams,
  ) => string;
}

/**
 * Hook genérico para manejo de datos paginados con cursor
 */
export const usePaginatedData = <TData, TParams = Record<string, unknown>>({
  baseUrl,
  queryKey,
  params,
  limit = 10,
  isEnabled = true,
  refetchOnMount = false,
  buildUrl,
}: UsePaginatedDataConfig<TParams>) => {
  const [cursor, setCursor] = useState<number | string | null>(null);
  const [allItems, setAllItems] = useState<TData[]>([]);

  // Función por defecto para construir la URL
  const defaultBuildUrl = (
    url: string,
    currentCursor?: number | string,
    currentLimit?: number,
    currentParams?: TParams,
  ) => {
    const urlParams = new URLSearchParams();

    if (currentCursor) {
      urlParams.append('cursor', currentCursor.toString());
    }

    if (currentLimit) {
      urlParams.append('limit', currentLimit.toString());
    }

    // Agregar parámetros adicionales
    if (currentParams) {
      Object.entries(currentParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlParams.append(key, value.toString());
        }
      });
    }

    return `${url}?${urlParams.toString()}`;
  };

  const urlBuilder = buildUrl || defaultBuildUrl;
  const finalUrl = urlBuilder(baseUrl, cursor || undefined, limit, params);

  // Crear clave única para React Query
  const reactQueryKey = [
    ...queryKey,
    cursor?.toString() || 'initial',
    limit.toString(),
    ...(params ? Object.values(params).map((v) => v?.toString() || '') : []),
  ];

  // Consulta con React Query
  const { data, isLoading, error, refetch } = FetchData<
    PaginatedResponse<TData>
  >({
    key: reactQueryKey,
    url: finalUrl,
    isEnabled,
    refetchOnMount,
  });

  // Actualizar lista cuando lleguen nuevos datos
  useEffect(() => {
    if (data && isEnabled) {
      if (cursor === null) {
        // Primera carga
        setAllItems(data.items || []);
      } else {
        // Cargar más elementos
        setAllItems((prev) => [...prev, ...(data.items || [])]);
      }
    }
  }, [data, cursor, isEnabled]);

  // Resetear estado cuando se deshabilite
  useEffect(() => {
    if (!isEnabled) {
      setAllItems([]);
      setCursor(null);
    }
  }, [isEnabled]);

  // Función para cargar más elementos
  const loadMore = () => {
    if (data?.nextCursor && !isLoading) {
      setCursor(data.nextCursor);
    }
  };

  // Función para resetear la paginación
  const reset = () => {
    setAllItems([]);
    setCursor(null);
  };

  // Función para refrescar desde el inicio
  const refresh = () => {
    reset();
    refetch();
  };

  return {
    // Datos
    items: allItems,
    currentPageData: data,

    // Estados
    isLoading,
    isLoadingMore: isLoading && cursor !== null, // Loading más páginas (no la primera)
    error,
    hasMore: data?.hasMore ?? false,

    // Acciones
    loadMore,
    reset,
    refresh,

    // Info de paginación
    cursor,
    totalLoaded: allItems.length,
  };
};

/**
 * Versión específica para comentarios (mantener compatibilidad)
 */
export const useCommentsPagination = ({
  postId,
  limit = 10,
  isEnabled = true,
}: {
  postId: number;
  limit?: number;
  isEnabled?: boolean;
}) => {
  // Importar Server1API dinámicamente para evitar dependencias circulares
  const Server1API =
    process.env.NEXT_PUBLIC_SERVER1_URL || 'http://localhost:3000';

  return usePaginatedData({
    baseUrl: `${Server1API}/feed/posts/${postId}/comments`,
    queryKey: ['comments', postId.toString()],
    limit,
    isEnabled,
    refetchOnMount: true,
  });
};
