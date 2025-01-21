export interface IPermission {
  check: (user?: IUser) => boolean;
  getErrorMessage: (user?: IUser) => string;
}

export enum ERole {
  GUEST = 'ROLE_GUEST',
  USER = 'ROLE_USER',
  ADMIN = 'ROLE_ADMIN',
  MASTER = 'ROLE_MASTER',
}

export interface IUser {
  getId: () => string | null;
  getUsername: () => string;
  getRole: () => IRole;
  isMaster: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
}

export interface IRole {
  get: () => ERole[];
  has: (role: ERole | IRole) => boolean;
  isMaster: () => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isGuest: () => boolean;
}

export interface IAuth {
  getUser: () => IUser | null;
  isAuthenticated: () => boolean;
}
