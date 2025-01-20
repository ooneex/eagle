import { ERole } from './types';

export const ROLE_HIERARCHY: Record<ERole, number> = {
  [ERole.MASTER]: 1,
  [ERole.ADMIN]: 2,
  [ERole.USER]: 3,
};
