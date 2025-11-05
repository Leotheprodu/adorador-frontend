import { findHrefFromLinks } from '../findHrefFromLinks';

// Mock de links para pruebas
jest.mock('../../config/links', () => ({
  links: [
    { name: 'Discipulado', href: '/discipulado' },
    { name: 'Crear cuenta', href: '/auth/sign-up', isLoggedIn: false },
    { name: 'Login', href: '/auth/login' },
    { name: 'Home', href: '/' },
  ],
}));

describe('findHrefFromLinks', () => {
  it('should return correct href for existing link name', () => {
    const result = findHrefFromLinks('Discipulado');
    expect(result).toBe('/discipulado');
  });

  it('should return href for Login', () => {
    const result = findHrefFromLinks('Login');
    expect(result).toBe('/auth/login');
  });

  it('should return href for sign-up', () => {
    const result = findHrefFromLinks('Crear cuenta');
    expect(result).toBe('/auth/sign-up');
  });

  it('should return "/" for non-existing link name', () => {
    const result = findHrefFromLinks('NonExistentLink');
    expect(result).toBe('/');
  });

  it('should return "/" for empty string', () => {
    const result = findHrefFromLinks('');
    expect(result).toBe('/');
  });

  it('should be case sensitive', () => {
    const result = findHrefFromLinks('discipulado'); // lowercase
    expect(result).toBe('/'); // Should not match 'Discipulado'
  });

  it('should handle special characters in link names', () => {
    const result = findHrefFromLinks('Link@#$%');
    expect(result).toBe('/');
  });
});
