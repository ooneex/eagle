import { PermissionException } from './PermissionException.ts';
import { IPermission, IUser } from './types.ts';

/**
 * Permission class handles authorization checks for user actions
 */
export class Permission {
  constructor(private readonly user: IUser) {}

  /**
   * Checks if the current user can manage a resource with the given ID
   * @param id The ID of the resource to check management permissions for
   * @returns true if user has permission, throws PermissionException otherwise
   * @throws PermissionException when user lacks required permissions
   */
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

  /**
   * Checks if the user satisfies the given permission requirement
   * @param permission The permission requirement to check against
   * @returns true if permission is granted, throws PermissionException otherwise
   * @throws PermissionException when user lacks required permissions
   */
  public with(permission: IPermission): boolean {
    if (permission.check(this.user)) {
      return true;
    }

    throw new PermissionException(permission.getErrorMessage(this.user));
  }
}
