import { setLocalStorage, getLocalStorage } from '../handleLocalStorage';

describe('handleLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('setLocalStorage', () => {
    it('should store object as JSON string', () => {
      const testObject = { name: 'John', age: 30 };
      setLocalStorage('user', testObject);

      const stored = localStorage.getItem('user');
      expect(stored).toBe(JSON.stringify(testObject));
    });

    it('should store string directly when isString is true', () => {
      const testString = 'Hello World';
      setLocalStorage('message', testString, true);

      const stored = localStorage.getItem('message');
      expect(stored).toBe(testString);
    });

    it('should store array as JSON string', () => {
      const testArray = [1, 2, 3, 4, 5];
      setLocalStorage('numbers', testArray);

      const stored = localStorage.getItem('numbers');
      expect(stored).toBe(JSON.stringify(testArray));
    });

    it('should store number as JSON string', () => {
      const testNumber = 42;
      setLocalStorage('count', testNumber);

      const stored = localStorage.getItem('count');
      expect(stored).toBe('42');
    });

    it('should store boolean as JSON string', () => {
      setLocalStorage('isActive', true);

      const stored = localStorage.getItem('isActive');
      expect(stored).toBe('true');
    });

    it('should overwrite existing value', () => {
      setLocalStorage('key', 'first value', true);
      setLocalStorage('key', 'second value', true);

      const stored = localStorage.getItem('key');
      expect(stored).toBe('second value');
    });
  });

  describe('getLocalStorage', () => {
    it('should retrieve and parse JSON object', () => {
      const testObject = { name: 'Jane', age: 25 };
      localStorage.setItem('user', JSON.stringify(testObject));

      const retrieved = getLocalStorage('user');
      expect(retrieved).toEqual(testObject);
    });

    it('should retrieve string directly when isString is true', () => {
      localStorage.setItem('message', 'Hello World');

      const retrieved = getLocalStorage('message', true);
      expect(retrieved).toBe('Hello World');
    });

    it('should return null for non-existent key', () => {
      const retrieved = getLocalStorage('nonExistent');
      expect(retrieved).toBeNull();
    });

    it('should return null for non-existent key with isString flag', () => {
      const retrieved = getLocalStorage('nonExistent', true);
      expect(retrieved).toBeNull();
    });

    it('should retrieve and parse array', () => {
      const testArray = ['a', 'b', 'c'];
      localStorage.setItem('letters', JSON.stringify(testArray));

      const retrieved = getLocalStorage('letters');
      expect(retrieved).toEqual(testArray);
    });

    it('should retrieve and parse number', () => {
      localStorage.setItem('count', '42');

      const retrieved = getLocalStorage('count');
      expect(retrieved).toBe(42);
    });

    it('should retrieve and parse boolean', () => {
      localStorage.setItem('isActive', 'true');

      const retrieved = getLocalStorage('isActive');
      expect(retrieved).toBe(true);
    });

    it('should handle invalid JSON gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem('invalid', 'not a json');

      const retrieved = getLocalStorage('invalid');

      expect(retrieved).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty string', () => {
      localStorage.setItem('empty', '""');

      const retrieved = getLocalStorage('empty');
      expect(retrieved).toBe('');
    });
  });

  describe('setLocalStorage and getLocalStorage integration', () => {
    it('should store and retrieve object correctly', () => {
      const testData = { id: 1, title: 'Test', completed: false };

      setLocalStorage('todo', testData);
      const retrieved = getLocalStorage('todo');

      expect(retrieved).toEqual(testData);
    });

    it('should store and retrieve string correctly', () => {
      const testString = 'Test Message';

      setLocalStorage('msg', testString, true);
      const retrieved = getLocalStorage('msg', true);

      expect(retrieved).toBe(testString);
    });

    it('should handle complex nested objects', () => {
      const complexObject = {
        user: {
          name: 'John',
          profile: {
            age: 30,
            hobbies: ['reading', 'coding'],
          },
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      };

      setLocalStorage('complex', complexObject);
      const retrieved = getLocalStorage('complex');

      expect(retrieved).toEqual(complexObject);
    });
  });
});
