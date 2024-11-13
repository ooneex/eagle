import { IValidator, validate, validator } from '@/validation/mod.ts';
import { describe } from '@std/testing/bdd';

import '@/app/register.ts';

describe('validate', () => {
  @validator()
  class UserValidator implements IValidator {
    public getScope() {
      return null;
    }
  }

  const testValidator = new UserValidator();

  validate(testValidator);
});
