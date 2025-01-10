import { container } from '@/container/container.ts';
import { ValidatorContainer } from './container.ts';
import type { IValidator, ValidatorScopeType } from './types.ts';

export const dispatch = async (
  dataScope: ValidatorScopeType,
): Promise<void> => {
  const validators = ValidatorContainer.get(dataScope) ?? [];

  for (const validator of validators) {
    const instance = container.get(validator.value) as IValidator;

    if (!instance) {
      continue;
    }

    await instance.validate(validator.options);
  }
};
