import { describe, expect, it } from 'bun:test';
import { ERole, Role } from '@/security';

describe('Role', () => {
  describe('constructor', () => {
    it('should create a Role instance with given roles', () => {
      const roles = [ERole.ADMIN];
      const role = new Role(roles);
      expect(role.get()).toEqual(roles);
    });
  });

  describe('has', () => {
    it('should return true when user has exact role', () => {
      const role = new Role([ERole.ADMIN]);
      expect(role.has(ERole.ADMIN)).toBe(true);
    });

    it('should return true when user has higher role', () => {
      const role = new Role([ERole.SUPER_ADMIN]);
      expect(role.has(ERole.ADMIN)).toBe(true);
      expect(role.has(ERole.USER)).toBe(true);
    });

    it('should return false when user has lower role', () => {
      const role = new Role([ERole.USER]);
      expect(role.has(ERole.ADMIN)).toBe(false);
      expect(role.has(ERole.SUPER_ADMIN)).toBe(false);
    });

    it('should work with multiple roles', () => {
      const role = new Role([ERole.USER, ERole.ADMIN]);
      expect(role.has(ERole.USER)).toBe(true);
      expect(role.has(ERole.ADMIN)).toBe(true);
      expect(role.has(ERole.SUPER_ADMIN)).toBe(false);
    });

    it('should work with Role instance', () => {
      const role = new Role([ERole.ADMIN]);
      const role2 = new Role([ERole.USER]);
      expect(role.has(role2)).toBe(true);
      expect(role2.has(role)).toBe(false);

      const role3 = new Role([ERole.SUPER_ADMIN]);
      const role4 = new Role([ERole.USER]);
      expect(role3.has(role4)).toBe(true);
      expect(role4.has(role3)).toBe(false);

      const multiRole = new Role([ERole.USER, ERole.SUPER_ADMIN]);
      const adminRole = new Role([ERole.ADMIN]);
      expect(multiRole.has(adminRole)).toBe(true);
      expect(adminRole.has(multiRole)).toBe(true);
    });
  });

  describe('role-specific checks', () => {
    it('should correctly check for SUPER_ADMIN', () => {
      const role = new Role([ERole.SUPER_ADMIN]);
      expect(role.isSuperAdmin()).toBe(true);
      expect(role.isUser()).toBe(true);
    });

    it('should correctly check for ADMIN', () => {
      const role = new Role([ERole.ADMIN]);
      expect(role.isAdmin()).toBe(true);
    });

    it('should correctly check for USER', () => {
      const role = new Role([ERole.USER]);
      expect(role.isUser()).toBe(true);
    });
  });
});
