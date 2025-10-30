// Flag global para evitar múltiples inicializaciones
let globalInitFlag = false;

// Función simple y directa para inicializar el usuario
export const initializeUserOnce = async () => {
  // Si ya se ejecutó, no hacer nada
  if (globalInitFlag) {
    return;
  }

  // Solo ejecutar en el browser
  if (typeof window === 'undefined') {
    return;
  }

  globalInitFlag = true;

  try {
    // Importaciones dinámicas
    const [userStore, localStorageUtils] = await Promise.all([
      import('@/global/stores/users'),
      import('../utils/handleLocalStorage'),
    ]);

    const { $user } = userStore;
    const { getLocalStorage, setLocalStorage } = localStorageUtils;

    const localUser = getLocalStorage('user');

    // Verificar si hay tokens válidos
    const jwtUtils = await import('../utils/jwtUtils');
    const tokens = jwtUtils.getTokens();
    const hasValidToken = tokens && !jwtUtils.isTokenExpired(tokens);

    console.log('[UserInit] Estado:', {
      hasLocalUser: !!localUser,
      localUserLoggedIn: localUser?.isLoggedIn,
      hasValidToken,
      tokenExpiry: tokens ? new Date(tokens.expiresAt).toLocaleString() : 'N/A',
    });

    // Si localUser es null o undefined, crear usuario por defecto
    if (!localUser) {
      const defaultUser = {
        id: 0,
        name: '',
        isLoggedIn: false,
        email: '',
        status: 'inactive' as const,
        roles: [],
        memberships: [],
        membersofBands: [],
        phone: '',
        birthdate: '',
      };
      setLocalStorage('user', defaultUser);
      $user.set(defaultUser);
    } else {
      // Si existe el usuario local y tiene token válido, mantener el estado logueado
      if (hasValidToken) {
        // Si hay token válido, el usuario DEBE estar logueado
        if (!localUser.isLoggedIn) {
          console.log(
            '[UserInit] Corrigiendo estado: Token válido pero usuario marcado como deslogueado',
          );
          const loggedInUser = { ...localUser, isLoggedIn: true };
          setLocalStorage('user', loggedInUser);
          $user.set(loggedInUser);
        } else {
          console.log('[UserInit] Usuario con token válido restaurado');
          $user.set(localUser);
        }
      } else if (localUser.isLoggedIn) {
        // Si no hay token válido pero el usuario aparece como logueado, desloguearlo
        console.log('[UserInit] Deslogueando usuario: No hay token válido');
        const loggedOutUser = { ...localUser, isLoggedIn: false };
        setLocalStorage('user', loggedOutUser);
        $user.set(loggedOutUser);
      } else {
        // Usuario no logueado y sin token válido - estado correcto
        console.log('[UserInit] Usuario sincronizado (sin sesión activa)');
        $user.set(localUser);
      }
    }
  } catch (error) {
    console.error('Error initializing user:', error);
    // Resetear flag para permitir reintento
    globalInitFlag = false;
  }
};

// Singleton global para controlar la inicialización del usuario (DEPRECATED)
class UserInitializer {
  private static instance: UserInitializer;
  private isInitialized = false;
  private isInitializing = false;

  static getInstance(): UserInitializer {
    if (!UserInitializer.instance) {
      UserInitializer.instance = new UserInitializer();
    }
    return UserInitializer.instance;
  }

  async initialize(): Promise<void> {
    // Si ya está inicializado o en proceso de inicialización, no hacer nada
    if (this.isInitialized || this.isInitializing) {
      return;
    }

    // Solo ejecutar en el browser
    if (typeof window === 'undefined') {
      return;
    }

    this.isInitializing = true;

    try {
      const { $user } = await import('@/global/stores/users');
      const { getLocalStorage, setLocalStorage } = await import(
        '../utils/handleLocalStorage'
      );

      // Pequeño delay para asegurar que la hidratación esté completa
      await new Promise((resolve) => setTimeout(resolve, 50));

      const localUser = getLocalStorage('user');

      // Si localUser es null o undefined, crear usuario por defecto
      if (!localUser) {
        const defaultUser = {
          id: 0,
          name: '',
          isLoggedIn: false,
          email: '',
          status: 'inactive' as const,
          roles: [],
          memberships: [],
          membersofBands: [],
          phone: '',
          birthdate: '',
        };
        setLocalStorage('user', defaultUser);
        $user.set(defaultUser);
        console.log('[UserInitializer] Usuario por defecto creado');
      } else {
        // Si existe el usuario local, sincronizar con el store si está vacío
        const currentUser = $user.get();
        if (currentUser.id === 0 && localUser.id !== 0) {
          $user.set(localUser);
          console.log(
            '[UserInitializer] Usuario sincronizado desde localStorage',
          );
        }
      }

      this.isInitialized = true;
      console.log('[UserInitializer] Inicialización completada');
    } catch (error) {
      console.error('[UserInitializer] Error initializing user:', error);
      // Resetear flags para permitir reintento
      this.isInitialized = false;
    } finally {
      this.isInitializing = false;
    }
  }

  reset(): void {
    this.isInitialized = false;
    this.isInitializing = false;
  }
}

export const userInitializer = UserInitializer.getInstance();
