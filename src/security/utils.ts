import { ERole } from './types.ts';

export const ROLE_HIERARCHY: Record<ERole, number> = {
  [ERole.SUPER_ADMIN]: 1,
  [ERole.ADMIN]: 2,
  [ERole.USER]: 3,
  [ERole.ANON]: 4,
};
