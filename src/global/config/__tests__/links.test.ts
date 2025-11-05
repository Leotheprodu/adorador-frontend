import { links } from '../links';

describe('links configuration', () => {
  it('should be an array', () => {
    expect(Array.isArray(links)).toBe(true);
  });

  it('should have at least one link', () => {
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have all links with name and href properties', () => {
    links.forEach((link) => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('href');
      expect(typeof link.name).toBe('string');
      expect(typeof link.href).toBe('string');
    });
  });

  describe('Discipulado link', () => {
    it('should exist', () => {
      const discipuladoLink = links.find((link) => link.name === 'Discipulado');
      expect(discipuladoLink).toBeDefined();
    });

    it('should have correct href', () => {
      const discipuladoLink = links.find((link) => link.name === 'Discipulado');
      expect(discipuladoLink?.href).toBe('/discipulado');
    });
  });

  describe('Crear cuenta link', () => {
    it('should exist', () => {
      const signUpLink = links.find((link) => link.name === 'Crear cuenta');
      expect(signUpLink).toBeDefined();
    });

    it('should have correct href', () => {
      const signUpLink = links.find((link) => link.name === 'Crear cuenta');
      expect(signUpLink?.href).toBe('/auth/sign-up');
    });

    it('should have isLoggedIn set to false', () => {
      const signUpLink = links.find((link) => link.name === 'Crear cuenta');
      expect(signUpLink?.isLoggedIn).toBe(false);
    });
  });

  describe('Login link', () => {
    it('should exist', () => {
      const loginLink = links.find((link) => link.name === 'Login');
      expect(loginLink).toBeDefined();
    });

    it('should have correct href', () => {
      const loginLink = links.find((link) => link.name === 'Login');
      expect(loginLink?.href).toBe('/auth/login');
    });
  });

  it('should have unique link names', () => {
    const names = links.map((link) => link.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it('should have unique hrefs', () => {
    const hrefs = links.map((link) => link.href);
    const uniqueHrefs = new Set(hrefs);
    expect(uniqueHrefs.size).toBe(hrefs.length);
  });

  it('should have valid href paths starting with /', () => {
    links.forEach((link) => {
      expect(link.href).toMatch(/^\//);
    });
  });

  it('should not have empty names', () => {
    links.forEach((link) => {
      expect(link.name.length).toBeGreaterThan(0);
    });
  });

  it('should not have empty hrefs', () => {
    links.forEach((link) => {
      expect(link.href.length).toBeGreaterThan(0);
    });
  });
});
