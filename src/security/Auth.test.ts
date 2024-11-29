import { IJwt } from '@/jwt/types.ts';
import { Auth, ERole } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

// Mock JWT implementation
class MockJwt implements IJwt {
  private valid: boolean;
  private username: string;
  private roles: ERole[];

  constructor(
    valid = true,
    username = 'testUser',
    roles: ERole[] = [ERole.USER],
  ) {
    this.valid = valid;
    this.username = username;
    this.roles = roles;
  }

  isValid(): boolean | Promise<boolean> {
    return this.valid;
  }

  getId(): string | null {
    return '65b7e7c4-331e-402c-ac54-de016a81c886';
  }

  getUsername(): string {
    return this.username;
  }

  getRoles(): ERole[] {
    return this.roles;
  }

  getToken(): string {
    return 'mock-token';
  }

  getPayload() {
    return {
      username: this.username,
      roles: this.roles,
    };
  }

  getHeader() {
    return { alg: 'HS256' };
  }

  getSecret(): string | null {
    return null;
  }

  getRefreshToken(): IJwt | null {
    return null;
  }
}

describe('Auth', () => {
  it('should successfully login with valid JWT', async () => {
    const auth = new Auth();
    const jwt = new MockJwt(true);

    const result = await auth.login(jwt);

    expect(result).toBe(true);
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.getUser()).not.toBe(null);
  });

  it('should fail login with invalid JWT', async () => {
    const auth = new Auth();
    const jwt = new MockJwt(false);

    const result = await auth.login(jwt);

    expect(result).toBe(false);
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.getUser()).toBe(null);
  });

  it('should handle logout correctly', async () => {
    const auth = new Auth();
    const jwt = new MockJwt(true);

    await auth.login(jwt);
    const logoutResult = auth.logout();

    expect(logoutResult).toBe(true);
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.getUser()).toBe(null);
  });

  it('should maintain authentication state', async () => {
    const auth = new Auth();
    const jwt = new MockJwt(true);

    await auth.login(jwt);
    const user = auth.getUser();

    expect(auth.isAuthenticated()).toBe(true);
    expect(user?.getUsername()).toBe('testUser');
    expect(user?.getRole().getRoles()).toContain(ERole.USER);
  });
});
