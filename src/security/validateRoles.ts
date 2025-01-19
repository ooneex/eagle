import { Role } from './Role.ts';
import { UnauthorizedException } from './UnauthorizedException.ts';
import type { ERole, IUser } from './types.ts';

export const validateRoles = (user: IUser, roles: ERole[]): void => {
  if (roles.length === 0) {
    throw new UnauthorizedException('No roles provided');
  }
  const role = new Role(roles);
  if (!user.getRole().has(role)) {
    throw new UnauthorizedException('User does not have the required roles', {
      user: {
        id: user.getId(),
        username: user.getUsername(),
        roles: user.getRole(),
      },
    });
  }
};
