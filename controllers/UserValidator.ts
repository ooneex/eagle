import { IValidator, validator } from '@/validation/mod.ts';
import { UserService } from './UserService.ts';

@validator()
export class UserValidator implements IValidator {
  name?: string | null = 'UserValidator';
  key: string[] = ['user'];
  type: (string | number)[] = [];
  user?: UserService;

  public getScope() {
    return null;
  }
}
