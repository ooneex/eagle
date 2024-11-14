import { IValidator, ValidatorScopeType } from '@/validation/types.ts';
import { validate } from '@/validation/validate.ts';

export abstract class AbstractValidator implements IValidator {
  abstract getScope(): ValidatorScopeType;

  public validate(data: unknown) {
    return validate(this, data);
  }
}
