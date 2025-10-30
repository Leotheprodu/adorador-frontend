// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (key: string, value: any, isString = false) => {
  if (typeof window !== 'undefined') {
    if (isString) {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const getLocalStorage = (key: string, isString = false) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);

    if (isString) {
      return item;
    } else {
      // Si el item es null, retornar null en lugar de intentar parsearlo
      if (item === null) {
        return null;
      }

      try {
        return JSON.parse(item);
      } catch (error) {
        console.error(`Error parsing localStorage item '${key}':`, error);
        return null;
      }
    }
  }

  return null;
};
