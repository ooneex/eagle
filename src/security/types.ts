import { IJwt } from '../jwt/types.ts';

/**
 * Interface for handling permission checks and error messages
 */
export interface IPermission {
  check: (user?: IUser) => boolean;
  getErrorMessage: (user?: IUser) => string;
}

/**
 * Enumeration of available user roles in the system
 */
export enum ERole {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN',
  SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
}

/**
 * Interface representing a user and their associated capabilities
 */
export interface IUser {
  getId: () => string | null;
  getUsername: () => string;
  getRole: () => IRole;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
}

/**
 * Interface for role-based access control functionality
 */
export interface IRole {
  getRoles: () => ERole[];
  hasRole: (role: ERole | IRole) => boolean;
  hasSuperAdmin: () => boolean;
  hasAdmin: () => boolean;
  hasUser: () => boolean;
}

/**
 * Interface for authentication-related operations
 */
export interface IAuth {
  getUser: () => IUser | null;
  login: (jwt: IJwt) => Promise<boolean> | boolean;
  logout: () => boolean;
  isAuthenticated: () => boolean;
}
