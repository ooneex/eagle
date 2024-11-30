import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import {
  ERole,
  IPermission,
  IUser,
  Permission,
  PermissionException,
} from './mod.ts';

describe('Permission', () => {
  class MockUser implements IUser {
    constructor(
      private id: string,
      private username: string,
      private admin: boolean = false,
    ) {}

    getId(): string {
      return this.id;
    }

    getUsername(): string {
      return this.username;
    }

    isAdmin(): boolean {
      return this.admin;
    }

    isSuperAdmin(): boolean {
      return false;
    }

    isUser(): boolean {
      return true;
    }

    isGuest(): boolean {
      return false;
    }

    getRole() {
      return {
        getRoles: () => [ERole.USER],
        hasRole: () => false,
        hasSuperAdmin: () => false,
        hasAdmin: () => false,
        hasUser: () => true,
      };
    }
  }

  describe('canManage', () => {
    it('should return true for admin users', () => {
      const adminUser = new MockUser('1', 'admin', true);
      const permission = new Permission(adminUser);

      expect(permission.canManage('2')).toBe(true);
    });

    it('should return true when user manages their own resource', () => {
      const user = new MockUser('1', 'user');
      const permission = new Permission(user);

      expect(permission.canManage('1')).toBe(true);
    });

    it('should throw PermissionException when user cannot manage resource', () => {
      const user = new MockUser('1', 'user');
      const permission = new Permission(user);

      expect(() => permission.canManage('2')).toThrow(PermissionException);
      expect(() => permission.canManage('2')).toThrow(
        'You are not allowed to manage this resource',
      );
    });
  });

  describe('can', () => {
    it('should return true when permission check passes', () => {
      const user = new MockUser('1', 'user');
      const permission = new Permission(user);
      const mockPermission: IPermission = {
        check: () => true,
        getErrorMessage: () => 'Error message',
      };

      expect(permission.with(mockPermission)).toBe(true);
    });

    it('should throw PermissionException when permission check fails', () => {
      const user = new MockUser('1', 'user');
      const permission = new Permission(user);
      const mockPermission: IPermission = {
        check: () => false,
        getErrorMessage: () => 'Custom error message',
      };

      expect(() => permission.with(mockPermission)).toThrow(
        PermissionException,
      );
      expect(() => permission.with(mockPermission)).toThrow(
        'Custom error message',
      );
    });
  });
});
