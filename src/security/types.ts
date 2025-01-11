export interface IPermission {
  check: (user?: IUser) => boolean;
  getErrorMessage: (user?: IUser) => string;
}

export enum ERole {
  USER = 1,
  ADMIN = 2,
  MASTER = 3,
}

export interface IUser {
  getId: () => string | null;
  getUsername: () => string;
  getRole: () => IRole;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
}

export interface IRole {
  get: () => ERole[];
  has: (role: ERole | IRole) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

export interface IAuth {
  getUser: () => IUser | null;
  isAuthenticated: () => boolean;
}
