import { IRole, IUser } from './types.ts';

export class User implements IUser {
  private username: string;
  private role: IRole;

  constructor(username: string, role: IRole) {
    this.username = username;
    this.role = role;
  }

  public getUsername(): string {
    return this.username;
  }

  public getRole(): IRole {
    return this.role;
  }

  public isSuperAdmin(): boolean {
    return this.role.hasSuperAdmin();
  }

  public isAdmin(): boolean {
    return this.role.hasAdmin();
  }

  public isUser(): boolean {
    return this.role.hasUser();
  }

  public isGuest(): boolean {
    return !this.isUser();
  }
}
