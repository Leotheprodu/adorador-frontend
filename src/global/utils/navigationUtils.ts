/**
 * Navega a una URL con un hard reload (recarga completa de la página)
 * Útil cuando necesitas garantizar que los datos se actualicen desde el servidor
 *
 * @param url - La URL a la que navegar (puede ser relativa o absoluta)
 * @example
 * ```ts
 * navigateWithReload('/grupos/123')
 * navigateWithReload('/grupos/123/canciones')
 * ```
 */
export const navigateWithReload = (url: string): void => {
  window.location.href = url;
};

/**
 * Navega hacia atrás a una página específica con hard reload
 * Útil para botones de "volver" que necesitan datos frescos
 *
 * @param url - La URL de la página anterior
 * @example
 * ```ts
 * handleBackNavigation('/grupos/123')
 * ```
 */
export const handleBackNavigation = (url: string): void => {
  navigateWithReload(url);
};
