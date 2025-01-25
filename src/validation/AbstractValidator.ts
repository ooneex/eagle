import {
  type ValidationError,
  type ValidatorOptions,
  validate,
  validateSync,
} from 'class-validator';

import type { IValidator, ValidationResultType } from './types';

export abstract class AbstractValidator implements IValidator {
  public async validate(
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ): Promise<ValidationResultType> {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, unknown>)[key] = value;
    }

    const errors = await validate(this, {
      ...validatorOptions,
      whitelist: true,
      forbidUnknownValues: true,
    });
    return this.parseResult(errors);
  }

  public validateSync(
    data: Record<string, unknown>,
    validatorOptions?: ValidatorOptions,
  ): ValidationResultType {
    for (const [key, value] of Object.entries(data)) {
      (this as Record<string, unknown>)[key] = value;
    }

    const errors = validateSync(this, {
      ...validatorOptions,
      whitelist: true,
      forbidUnknownValues: true,
    });
    return this.parseResult(errors);
  }

  private parseResult(errors: ValidationError[]): ValidationResultType {
    return {
      success: errors.length === 0,
      logs: errors,
      details: errors.map((error) => ({
        property: error.property,
        value: error.value,
        constraints: Object.entries(error.constraints ?? {}).map(
          ([key, value]) => ({
            name: key,
            message: value,
          }),
        ),
      })),
    };
  }
}
