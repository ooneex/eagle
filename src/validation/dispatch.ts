import { container } from '@/container/container.ts';
import { ValidationFailedException } from './ValidationFailedException.ts';
import { ValidatorContainer } from './container.ts';
import type { IValidator, ValidatorScopeType } from './types.ts';

export const dispatch = async (
  dataScope: ValidatorScopeType,
  data: Record<string, unknown>,
): Promise<void> => {
  const validators = ValidatorContainer.get(dataScope) ?? [];

  for (const validator of validators) {
    const instance = container.get(validator.value) as IValidator;

    if (!instance) {
      continue;
    }

    const result = await instance.validate(data, validator.options);
    if (!result.success) {
      throw new ValidationFailedException(
        `${validator.value.name}: Validation failed`,
        result,
      );
    }
  }
};
