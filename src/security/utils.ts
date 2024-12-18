import { ERole } from './types.ts';

/**
 * Defines the hierarchy of user roles in the system.
 * Lower numbers indicate higher privileges/authority levels.
 * 1 = Highest privilege (SUPER_ADMIN)
 * 3 = Lowest privilege (USER)
 */
export const ROLE_HIERARCHY: Record<ERole, number> = {
  [ERole.SUPER_ADMIN]: 1,
  [ERole.ADMIN]: 2,
  [ERole.USER]: 3,
};
