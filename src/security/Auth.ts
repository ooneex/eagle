import { IJwt } from '@/jwt/types.ts';
import { Role } from '@/security/Role.ts';
import { IAuth, IUser } from '@/security/types.ts';
import { User } from '@/security/User.ts';

export class Auth implements IAuth {
  private user: IUser | null = null;
  private jwt: IJwt | null = null;

  public async login(jwt: IJwt): Promise<boolean> {
    if (!(await jwt.isValid())) {
      return false;
    }

    this.jwt = jwt;

    const username = jwt.getUsername();
    const roles = jwt.getRoles();

    this.user = new User(username, new Role(roles));

    return !this.user.isAnon();
  }

  public isAuthenticated(): boolean {
    if (!this.user || !this.jwt || !this.jwt.isValid()) {
      return false;
    }

    return !this.user.isAnon();
  }

  public logout(): boolean {
    this.user = null;
    this.jwt = null;

    return true;
  }

  public getUser(): IUser | null {
    return this.user;
  }
}