import { IJwt } from '../jwt/types.ts';
import { Role } from '../security/Role.ts';
import { IAuth, IUser } from '../security/types.ts';
import { User } from '../security/User.ts';

/**
 * Authentication class that manages user login state and JWT tokens
 * Implements the IAuth interface for authentication operations
 */
export class Auth implements IAuth {
  private user: IUser | null = null;
  private jwt: IJwt | null = null;

  /**
   * Attempts to log in a user with the provided JWT token
   * @param jwt The JWT token to authenticate with
   * @returns Promise<boolean> True if login successful, false otherwise
   */
  public async login(jwt: IJwt): Promise<boolean> {
    if (!(await jwt.isValid())) {
      return false;
    }

    this.jwt = jwt;

    const username = jwt.getUsername();
    const roles = jwt.getRoles();
    const id = jwt.getId();

    this.user = new User(username, new Role(roles), id);

    return this.user.isUser();
  }

  /**
   * Checks if there is currently an authenticated user session
   * @returns boolean True if user is authenticated, false otherwise
   */
  public isAuthenticated(): boolean {
    if (!this.user || !this.jwt || !this.jwt.isValid()) {
      return false;
    }

    return this.user.isUser();
  }

  /**
   * Logs out the current user by clearing stored user and JWT data
   * @returns boolean True after successful logout
   */
  public logout(): boolean {
    this.user = null;
    this.jwt = null;

    return true;
  }

  /**
   * Gets the currently authenticated user
   * @returns IUser | null The current user or null if not authenticated
   */
  public getUser(): IUser | null {
    return this.user;
  }
}
