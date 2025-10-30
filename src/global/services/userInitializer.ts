// Flag global para evitar múltiples inicializaciones
let globalInitFlag = false;

// Función para resetear el flag (útil para debug)
export const resetUserInit = () => {
  globalInitFlag = false;
  console.log('[UserInit] Flag reseteado');
};

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
      console.log('[UserInit] Usuario por defecto creado');
    } else {
      // Si existe el usuario local, sincronizar con el store si está vacío
      const currentUser = $user.get();
      if (currentUser.id === 0 && localUser.id !== 0) {
        $user.set(localUser);
        console.log('[UserInit] Usuario sincronizado desde localStorage');
      }
    }

    console.log('[UserInit] Inicialización completada');
  } catch (error) {
    console.error('[UserInit] Error:', error);
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

// Hacer disponible en window para debug en producción
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).resetUserInit = resetUserInit;
  (window as unknown as Record<string, unknown>).initializeUserOnce =
    initializeUserOnce;
}
