// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setLocalStorage = (key: string, value: any, isString = false) => {
  if (typeof window !== "undefined") {
    if (isString) {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const getLocalStorage = (key: string, isString = false) => {
  if (typeof window !== "undefined") {
    if (isString) {
      return localStorage.getItem(key);
    } else {
      return JSON.parse(localStorage.getItem(key) as string);
    }
  }
};
