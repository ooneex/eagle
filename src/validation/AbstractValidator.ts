import { type ValidatorOptions, validate, validateSync } from 'class-validator';
import type { IValidator, ValidationResultType } from './types.ts';

export abstract class AbstractValidator implements IValidator {
  public async validate(
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ): Promise<ValidationResultType> {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, unknown>)[key] = value;
    }

    const errors = await validate(this, validatorOptions);
    return {
      success: errors.length === 0,
      details: errors,
    };
  }

  public validateSync(
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ): ValidationResultType {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, unknown>)[key] = value;
    }

    const errors = validateSync(this, validatorOptions);
    return {
      success: errors.length === 0,
      details: errors,
    };
  }
}
