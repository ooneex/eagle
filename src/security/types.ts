import { IJwt } from '../jwt/types.ts';

export enum ERole {
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN',
  SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
}

export interface IUser {
  getUsername: () => string;
  getRole: () => IRole;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
}

export interface IRole {
  getRoles: () => ERole[];
  hasRole: (role: ERole) => boolean;
  hasSuperAdmin: () => boolean;
  hasAdmin: () => boolean;
  hasUser: () => boolean;
}

export interface IAuth {
  getUser: () => IUser | null;
  login: (jwt: IJwt) => Promise<boolean> | boolean;
  logout: () => boolean;
  isAuthenticated: () => boolean;
}
