import { describe, expect, it } from 'bun:test';
import { ERole, ROLE_HIERARCHY } from '.';

describe('ROLE_HIERARCHY', () => {
  it('should define correct hierarchy levels', () => {
    expect(ROLE_HIERARCHY[ERole.MASTER]).toBe(1);
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBe(2);
    expect(ROLE_HIERARCHY[ERole.USER]).toBe(3);
  });

  it('should maintain correct hierarchical order', () => {
    // SUPER_ADMIN should have lowest number (highest privilege)
    expect(ROLE_HIERARCHY[ERole.MASTER]).toBeLessThan(
      ROLE_HIERARCHY[ERole.ADMIN],
    );
    expect(ROLE_HIERARCHY[ERole.MASTER]).toBeLessThan(
      ROLE_HIERARCHY[ERole.USER],
    );

    // ADMIN should be between SUPER_ADMIN and USER
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.MASTER],
    );
    expect(ROLE_HIERARCHY[ERole.ADMIN]).toBeLessThan(
      ROLE_HIERARCHY[ERole.USER],
    );

    // USER should have highest number (lowest privilege)
    expect(ROLE_HIERARCHY[ERole.USER]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.MASTER],
    );
    expect(ROLE_HIERARCHY[ERole.USER]).toBeGreaterThan(
      ROLE_HIERARCHY[ERole.ADMIN],
    );
  });

  it('should include all roles from ERole enum', () => {
    // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
    const roleValues = Object.values(ERole).filter((v) => !isNaN(Number(v)));
    const hierarchyKeys = Object.keys(ROLE_HIERARCHY).map(Number);

    expect(hierarchyKeys.length).toBe(roleValues.length);
    for (const role of roleValues) {
      expect(ROLE_HIERARCHY[role as ERole]).toBeDefined();
    }
  });
});
