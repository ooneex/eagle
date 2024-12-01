import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { ERole, ROLE_HIERARCHY } from './mod.ts';

describe('ROLE_HIERARCHY', () => {
  it('should define correct hierarchy levels', () => {
    expect(ROLE_HIERARCHY[ERole.SUPER_ADMIN]).toBe(1);
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBe(2);
    expect(ROLE_HIERARCHY[ERole.USER]).toBe(3);
  });

  it('should maintain correct hierarchical order', () => {
    // SUPER_ADMIN should have lowest number (highest privilege)
    expect(ROLE_HIERARCHY[ERole.SUPER_ADMIN]).toBeLessThan(
      ROLE_HIERARCHY[ERole.ADMIN],
    );
    expect(ROLE_HIERARCHY[ERole.SUPER_ADMIN]).toBeLessThan(
      ROLE_HIERARCHY[ERole.USER],
    );

    // ADMIN should be between SUPER_ADMIN and USER
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.SUPER_ADMIN],
    );
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBeLessThan(
      ROLE_HIERARCHY[ERole.USER],
    );

    // USER should have highest number (lowest privilege)
    expect(ROLE_HIERARCHY[ERole.USER]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.SUPER_ADMIN],
    );
    expect(ROLE_HIERARCHY[ERole.USER]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.ADMIN],
    );
  });

  it('should include all roles from ERole enum', () => {
    const roleValues = Object.values(ERole);
    const hierarchyKeys = Object.keys(ROLE_HIERARCHY);

    expect(hierarchyKeys.length).toBe(roleValues.length);
    roleValues.forEach((role) => {
      expect(ROLE_HIERARCHY[role]).toBeDefined();
    });
  });
});
