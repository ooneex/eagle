import { ERole, IRole } from './types.ts';
import { ROLE_HIERARCHY } from './utils.ts';

/**
 * Class representing a role with hierarchical permissions.
 * Implements the IRole interface for role-based access control.
 */
export class Role implements IRole {
  /** Array of roles assigned to this instance */
  private readonly roles: ERole[];

  /**
   * Creates a new Role instance
   * @param roles Array of ERole enums to assign to this role
   */
  constructor(roles: ERole[]) {
    this.roles = roles;
  }

  /**
   * Gets the array of assigned roles
   * @returns Array of ERole enums
   */
  public getRoles(): ERole[] {
    return this.roles;
  }

  /**
   * Checks if this role has the specified role or higher in the hierarchy
   * @param role Role to check against - can be ERole enum or IRole instance
   * @returns Boolean indicating if this role has the specified permissions
   */
  public hasRole(role: ERole | IRole): boolean {
    if (role instanceof Role) {
      for (const r of role.getRoles()) {
        const has = this.roles.some((requiredRole) =>
          this.checkRole(r, requiredRole)
        );

        if (has) return true;
      }

      return false;
    }

    return this.roles.some((requiredRole) =>
      this.checkRole(role as ERole, requiredRole)
    );
  }

  /**
   * Checks if this role has SUPER_ADMIN permissions
   * @returns Boolean indicating if role is SUPER_ADMIN
   */
  public hasSuperAdmin(): boolean {
    return this.hasRole(ERole.SUPER_ADMIN);
  }

  /**
   * Checks if this role has ADMIN permissions
   * @returns Boolean indicating if role is ADMIN
   */
  public hasAdmin(): boolean {
    return this.hasRole(ERole.ADMIN);
  }

  /**
   * Checks if this role has USER permissions
   * @returns Boolean indicating if role is USER
   */
  public hasUser(): boolean {
    return this.hasRole(ERole.USER);
  }

  /**
   * Internal method to check role hierarchy
   * @param role Role to check
   * @param requiredRole Required role to check against
   * @returns Boolean indicating if role meets or exceeds required permissions
   */
  private checkRole(role: ERole, requiredRole: ERole): boolean {
    return ROLE_HIERARCHY[requiredRole] <= ROLE_HIERARCHY[role];
  }
}
