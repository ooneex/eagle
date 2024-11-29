import { IRole, IUser } from './types.ts';

export class User implements IUser {
  private id: string | null;
  private username: string;
  private role: IRole;

  constructor(username: string, role: IRole, id?: string | null) {
    this.username = username;
    this.role = role;
    this.id = id ?? null;
  }

  public getId(): string | null {
    return this.id;
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
