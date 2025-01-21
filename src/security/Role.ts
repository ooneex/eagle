import { ERole, type IRole } from './types';
import { ROLE_HIERARCHY } from './utils';

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

  public isMaster(): boolean {
    return this.has(ERole.MASTER);
  }

  public isAdmin(): boolean {
    return this.has(ERole.ADMIN);
  }

  public isUser(): boolean {
    return this.has(ERole.USER);
  }

  public isGuest(): boolean {
    return this.has(ERole.GUEST);
  }

  private checkRole(role: ERole, requiredRole: ERole): boolean {
    return ROLE_HIERARCHY[requiredRole] <= ROLE_HIERARCHY[role];
  }
}
