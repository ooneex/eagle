import { ERole, Role } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Role', () => {
  describe('constructor', () => {
    it('should create a Role instance with given roles', () => {
      const roles = [ERole.ADMIN];
      const role = new Role(roles);
      expect(role.getRoles()).toEqual(roles);
    });
  });

  describe('hasRole', () => {
    it('should return true when user has exact role', () => {
      const role = new Role([ERole.ADMIN]);
      expect(role.hasRole(ERole.ADMIN)).toBe(true);
    });

    it('should return true when user has higher role', () => {
      const role = new Role([ERole.SUPER_ADMIN]);
      expect(role.hasRole(ERole.ADMIN)).toBe(true);
      expect(role.hasRole(ERole.USER)).toBe(true);
    });

    it('should return false when user has lower role', () => {
      const role = new Role([ERole.USER]);
      expect(role.hasRole(ERole.ADMIN)).toBe(false);
      expect(role.hasRole(ERole.SUPER_ADMIN)).toBe(false);
    });

    it('should work with multiple roles', () => {
      const role = new Role([ERole.USER, ERole.ADMIN]);
      expect(role.hasRole(ERole.USER)).toBe(true);
      expect(role.hasRole(ERole.ADMIN)).toBe(true);
      expect(role.hasRole(ERole.SUPER_ADMIN)).toBe(false);
    });
  });

  describe('role-specific checks', () => {
    it('should correctly check for SUPER_ADMIN', () => {
      const role = new Role([ERole.SUPER_ADMIN]);
      expect(role.hasSuperAdmin()).toBe(true);
    });

    it('should correctly check for ADMIN', () => {
      const role = new Role([ERole.ADMIN]);
      expect(role.hasAdmin()).toBe(true);
    });

    it('should correctly check for USER', () => {
      const role = new Role([ERole.USER]);
      expect(role.hasUser()).toBe(true);
    });

    it('should correctly check for ANON', () => {
      const role = new Role([ERole.ANON]);
      expect(role.hasAnon()).toBe(true);
    });
  });
});