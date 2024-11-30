import { PermissionException } from './PermissionException.ts';
import { IPermission, IUser } from './types.ts';

export class Permission {
  constructor(private readonly user: IUser) {}

  public canManage(id: string) {
    if (this.user.isAdmin()) {
      return true;
    }

    if (this.user.getId() === id) {
      return true;
    }

    throw new PermissionException(
      'You are not allowed to manage this resource',
      {
        id,
        user: {
          id: this.user.getId(),
          username: this.user.getUsername(),
          roles: this.user.getRole().getRoles(),
        },
      },
    );
  }

  public with(permission: IPermission): boolean {
    if (permission.check(this.user)) {
      return true;
    }

    throw new PermissionException(permission.getErrorMessage(this.user));
  }
}
