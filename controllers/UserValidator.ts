import { IValidator, validator } from '@/validation/mod.ts';

@validator()
export class UserValidator implements IValidator {
  name?: string | null = 'UserValidator';
  key: string[] = ['user'];

  public getScope() {
    return null;
  }
}
