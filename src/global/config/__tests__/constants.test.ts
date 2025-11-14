import { appName, appDescription, userRoles, churchRoles } from '../constants';

describe('constants', () => {
  describe('App Configuration', () => {
    it('should have correct app name', () => {
      expect(appName).toBe('Zamr');
    });

    it('should have app description', () => {
      expect(appDescription).toBeTruthy();
      expect(appDescription).toContain('Zamr');
      expect(appDescription).toContain('cristiana');
    });
  });

  describe('User Roles', () => {
    it('should have admin role defined', () => {
      expect(userRoles.admin).toBeDefined();
      expect(userRoles.admin.id).toBe(1);
      expect(userRoles.admin.name).toBe('admin');
    });

    it('should have user role defined', () => {
      expect(userRoles.user).toBeDefined();
      expect(userRoles.user.id).toBe(2);
      expect(userRoles.user.name).toBe('user');
    });

    it('should have moderator role defined', () => {
      expect(userRoles.moderator).toBeDefined();
      expect(userRoles.moderator.id).toBe(3);
      expect(userRoles.moderator.name).toBe('moderator');
    });

    it('should have editor role defined', () => {
      expect(userRoles.editor).toBeDefined();
      expect(userRoles.editor.id).toBe(4);
      expect(userRoles.editor.name).toBe('editor');
    });

    it('should have unique role IDs', () => {
      const ids = Object.values(userRoles).map((role) => role.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all roles with id and name properties', () => {
      Object.values(userRoles).forEach((role) => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('name');
        expect(typeof role.id).toBe('number');
        expect(typeof role.name).toBe('string');
      });
    });
  });

  describe('Church Roles', () => {
    it('should have pastor role defined', () => {
      expect(churchRoles.pastor).toBeDefined();
      expect(churchRoles.pastor.id).toBe(1);
      expect(churchRoles.pastor.name).toBe('Pastor');
    });

    it('should have worship leader role defined', () => {
      expect(churchRoles.worshipLeader).toBeDefined();
      expect(churchRoles.worshipLeader.id).toBe(2);
      expect(churchRoles.worshipLeader.name).toBe('Líder de Alabanza');
    });

    it('should have musician role defined', () => {
      expect(churchRoles.musician).toBeDefined();
      expect(churchRoles.musician.id).toBe(3);
      expect(churchRoles.musician.name).toBe('Músico');
    });

    it('should have youth leader role defined', () => {
      expect(churchRoles.youthLeader).toBeDefined();
      expect(churchRoles.youthLeader.id).toBe(4);
      expect(churchRoles.youthLeader.name).toBe('Líder de Jóvenes');
    });

    it('should have deacon role defined', () => {
      expect(churchRoles.deacon).toBeDefined();
      expect(churchRoles.deacon.id).toBe(5);
      expect(churchRoles.deacon.name).toBe('Diácono');
    });

    it('should have teacher role defined', () => {
      expect(churchRoles.teacher).toBeDefined();
      expect(churchRoles.teacher.id).toBe(6);
      expect(churchRoles.teacher.name).toBe('Maestro');
    });

    it('should have unique church role IDs', () => {
      const ids = Object.values(churchRoles).map((role) => role.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all church roles with id and name properties', () => {
      Object.values(churchRoles).forEach((role) => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('name');
        expect(typeof role.id).toBe('number');
        expect(typeof role.name).toBe('string');
        expect(role.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Roles Comparison', () => {
    it('should have different number of user roles vs church roles', () => {
      const userRolesCount = Object.keys(userRoles).length;
      const churchRolesCount = Object.keys(churchRoles).length;
      expect(userRolesCount).not.toBe(churchRolesCount);
    });

    it('should have at least 4 user roles', () => {
      expect(Object.keys(userRoles).length).toBeGreaterThanOrEqual(4);
    });

    it('should have at least 6 church roles', () => {
      expect(Object.keys(churchRoles).length).toBeGreaterThanOrEqual(6);
    });
  });
});
