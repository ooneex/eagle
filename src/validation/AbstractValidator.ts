import { type ValidatorOptions, validate } from 'class-validator';
import type { IValidator, ValidationResultType } from './types.ts';

export abstract class AbstractValidator implements IValidator {
  public async validate(
    validatorOptions?: ValidatorOptions,
  ): Promise<ValidationResultType> {
    const errors = await validate(this, validatorOptions);
    return {
      success: errors.length === 0,
      details: errors,
    };
  }
}
