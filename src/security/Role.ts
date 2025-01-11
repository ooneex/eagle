import { ERole, type IRole } from './types.ts';
import { ROLE_HIERARCHY } from './utils.ts';

export class Role implements IRole {
  private readonly roles: ERole[];

  constructor(roles: ERole[]) {
    this.roles = roles;
  }

  public get(): ERole[] {
    return this.roles;
  }

  public has(role: ERole | IRole): boolean {
    if (role instanceof Role) {
      for (const r of role.get()) {
        const has = this.roles.some((requiredRole) =>
          this.checkRole(r, requiredRole),
        );

        if (has) return true;
      }

      return false;
    }

    return this.roles.some((requiredRole) =>
      this.checkRole(role as ERole, requiredRole),
    );
  }

  public isSuperAdmin(): boolean {
    return this.has(ERole.SUPER_ADMIN);
  }

  public isAdmin(): boolean {
    return this.has(ERole.ADMIN);
  }

  public isUser(): boolean {
    return this.has(ERole.USER);
  }

  private checkRole(role: ERole, requiredRole: ERole): boolean {
    return ROLE_HIERARCHY[requiredRole] <= ROLE_HIERARCHY[role];
  }
}
