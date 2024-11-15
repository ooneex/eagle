import { ERole, IRole, User } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

class MockRole implements IRole {
  constructor(
    private superAdmin = false,
    private admin = false,
    private user = false,
    private anon = false,
  ) {}

  getRoles(): ERole[] {
    const roles: ERole[] = [];
    if (this.superAdmin) roles.push(ERole.SUPER_ADMIN);
    if (this.admin) roles.push(ERole.ADMIN);
    if (this.user) roles.push(ERole.USER);
    if (this.anon) roles.push(ERole.ANON);
    return roles;
  }

  hasRole(role: ERole): boolean {
    return this.getRoles().includes(role);
  }

  hasSuperAdmin(): boolean {
    return this.superAdmin;
  }

  hasAdmin(): boolean {
    return this.admin;
  }

  hasUser(): boolean {
    return this.user;
  }

  hasAnon(): boolean {
    return this.anon;
  }
}

describe('User', () => {
  it('should create a user with username and role', () => {
    const role = new MockRole();
    const user = new User('testuser', role);

    expect(user.getUsername()).toBe('testuser');
    expect(user.getRole()).toBe(role);
  });

  it('should correctly identify super admin role', () => {
    const role = new MockRole(true, false, false, false);
    const user = new User('admin', role);

    expect(user.isSuperAdmin()).toBe(true);
    expect(user.isAdmin()).toBe(false);
    expect(user.isUser()).toBe(false);
    expect(user.isAnon()).toBe(false);
  });

  it('should correctly identify admin role', () => {
    const role = new MockRole(false, true, false, false);
    const user = new User('admin', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(true);
    expect(user.isUser()).toBe(false);
    expect(user.isAnon()).toBe(false);
  });

  it('should correctly identify user role', () => {
    const role = new MockRole(false, false, true, false);
    const user = new User('user', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(false);
    expect(user.isUser()).toBe(true);
    expect(user.isAnon()).toBe(false);
  });

  it('should correctly identify anonymous role', () => {
    const role = new MockRole(false, false, false, true);
    const user = new User('anon', role);

    expect(user.isSuperAdmin()).toBe(false);
    expect(user.isAdmin()).toBe(false);
    expect(user.isUser()).toBe(false);
    expect(user.isAnon()).toBe(true);
  });
});
