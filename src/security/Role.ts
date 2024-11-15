import { ERole } from '@/security/types.ts';
import { ROLE_HIERARCHY } from '@/security/utils.ts';

export class Role {
  private readonly roles: ERole[];

  constructor(roles: ERole[]) {
    this.roles = roles;
  }

  public getRoles(): ERole[] {
    return this.roles;
  }

  public hasRole(role: ERole): boolean {
    return this.roles.some((requiredRole) =>
      this.checkRole(role, requiredRole)
    );
  }

  public hasSuperAdmin(): boolean {
    return this.hasRole(ERole.SUPER_ADMIN);
  }

  public hasAdmin(): boolean {
    return this.hasRole(ERole.ADMIN);
  }

  public hasUser(): boolean {
    return this.hasRole(ERole.USER);
  }

  public hasAnon(): boolean {
    return this.hasRole(ERole.ANON);
  }

  private checkRole(role: ERole, requiredRole: ERole): boolean {
    return ROLE_HIERARCHY[requiredRole] <= ROLE_HIERARCHY[role];
  }
}
