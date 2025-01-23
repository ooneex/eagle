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
    let data = config.data;

    if (validator.value.beforeValidate) {
      data = validator.value.beforeValidate(data);
    }

    const result = await validator.value.validate(config.data);
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
