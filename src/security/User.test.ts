import { ERole, User } from '@/security/mod.ts';
import { Role } from '@/security/Role.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('User', () => {
  it('should create a user with username and role', () => {
    const role = new Role([]);
    const user = new User('test_user', role);

    expect(user.getUsername()).toBe('test_user');
    expect(user.getRole()).toBe(role);
  });

  it('should correctly identify super admin role', () => {
    const role = new Role([ERole.SUPER_ADMIN]);
    const user = new User('admin', role);

    expect(user.isSuperAdmin()).toBe(true);
    expect(user.isAdmin()).toBe(true);
    expect(user.isUser()).toBe(true);
    expect(user.isGuest()).toBe(false);
  });

  it('should correctly identify admin role', () => {
    const role = new Role([ERole.ADMIN]);
    const user = new User('admin', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(true);
    expect(user.isUser()).toBe(true);
    expect(user.isGuest()).toBe(false);
  });

  it('should correctly identify user role', () => {
    const role = new Role([ERole.USER]);
    const user = new User('user', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(false);
    expect(user.isUser()).toBe(true);
    expect(user.isGuest()).toBe(false);
  });

  it('should correctly identify anonymous role', () => {
    const role = new Role([]);
    const user = new User('anon', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(false);
    expect(user.isUser()).toBe(false);
    expect(user.isGuest()).toBe(true);
  });
});
