import { ValidationFailedException } from 'src/validation/ValidationFailedException';
import type { ValidatorScopeType } from '../validation/types';
import type { ControllerRouteConfigType } from './types';

export const dispatchControllerValidator = async (config: {
  dataScope: ValidatorScopeType;
  data: Record<string, unknown>;
  routeConfig: ControllerRouteConfigType;
}): Promise<void> => {
  const validators = (config.routeConfig.validators ?? []).filter(
    (v) => v.scope === config.dataScope,
  );

  for (const validator of validators) {
    const result = await validator.value.validate(
      validator.value.beforeValidate
        ? validator.value.beforeValidate(config.data)
        : config.data,
    );
    if (!result.success) {
      throw new ValidationFailedException(
        `${validator.value.constructor.name}: Validation failed`,
        {
          validation: result,
        },
      );
    }
  }
};
