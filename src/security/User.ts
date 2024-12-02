import { IRole, IUser } from './types.ts';

/**
 * Represents a user in the system with associated role and permissions
 * @implements {IUser}
 */
export class User implements IUser {
  private id: string | null;
  private username: string;
  private role: IRole;

  /**
   * Creates a new User instance
   * @param {string} username - The username for the user
   * @param {IRole} role - The role assigned to the user
   * @param {string | null} [id] - Optional user ID
   */
  constructor(username: string, role: IRole, id?: string | null) {
    this.username = username;
    this.role = role;
    this.id = id ?? null;
  }

  /**
   * Gets the user's ID
   * @returns {string | null} The user's ID or null if not set
   */
  public getId(): string | null {
    return this.id;
  }

  /**
   * Gets the user's username
   * @returns {string} The username
   */
  public getUsername(): string {
    return this.username;
  }

  /**
   * Gets the user's role
   * @returns {IRole} The user's role object
   */
  public getRole(): IRole {
    return this.role;
  }

  /**
   * Checks if the user has super admin privileges
   * @returns {boolean} True if user is a super admin
   */
  public isSuperAdmin(): boolean {
    return this.role.hasSuperAdmin();
  }

  /**
   * Checks if the user has admin privileges
   * @returns {boolean} True if user is an admin
   */
  public isAdmin(): boolean {
    return this.role.hasAdmin();
  }

  /**
   * Checks if the user has basic user privileges
   * @returns {boolean} True if user has basic access
   */
  public isUser(): boolean {
    return this.role.hasUser();
  }

  /**
   * Checks if the user is a guest (no user privileges)
   * @returns {boolean} True if user is a guest
   */
  public isGuest(): boolean {
    return !this.isUser();
  }
}
