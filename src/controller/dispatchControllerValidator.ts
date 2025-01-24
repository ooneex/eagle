import { ValidationFailedException } from 'src/validation/ValidationFailedException';
import type { ValidatorScopeType } from '../validation/types';
import type { ControllerRouteConfigType } from './types';

export const dispatchControllerValidator = async (config: {
  dataScope: ValidatorScopeType;
  data: Record<string, unknown>;
  routeConfig: ControllerRouteConfigType;
}): Promise<Record<string, unknown>[]> => {
  const validators = (config.routeConfig.validators ?? []).filter(
    (v) => v.scope === config.dataScope,
  );

  const results: Record<string, unknown>[] = [];

  for (const validator of validators) {
    const data = validator.value.beforeValidate
      ? validator.value.beforeValidate(config.data)
      : config.data;

    results.push(data);

    const result = await validator.value.validate(data);
    if (!result.success) {
      throw new ValidationFailedException(
        `${validator.value.constructor.name}: Validation failed`,
        {
          validation: result,
        },
      );
    }
  }

  return results;
};
