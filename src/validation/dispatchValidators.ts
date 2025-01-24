import { container } from '../container';
import { ValidationFailedException } from './ValidationFailedException';
import { ValidatorContainer } from './container';
import type { IValidator, ValidatorScopeType } from './types';

export const dispatchValidators = async (
  dataScope: ValidatorScopeType,
  data: Record<string, unknown>,
): Promise<void> => {
  const validators = ValidatorContainer.get(dataScope) ?? [];

  for (const validator of validators) {
    const instance = container.get(validator.value) as IValidator;

    if (!instance) {
      continue;
    }

    if (instance.beforeValidate) {
      data = instance.beforeValidate(data);
    }

    const result = await instance.validate(data, validator.options);
    if (!result.success) {
      throw new ValidationFailedException(
        `${validator.value.name}: Validation failed`,
        {
          validation: result,
        },
      );
    }

    if (instance.afterValidate) {
      instance.afterValidate(data);
    }
  }
};
