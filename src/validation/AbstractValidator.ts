import { IValidator, ValidatorScopeType } from './types.ts';
import { validate } from './validate.ts';

export abstract class AbstractValidator implements IValidator {
  abstract getScope(): ValidatorScopeType;

  public validate(data: unknown) {
    return validate(this, data);
  }
}
