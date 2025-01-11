import { ValidationFailedException } from '@/validation/ValidationFailedException.ts';
import type { ValidatorScopeType } from '@/validation/types.ts';
import type { ControllerRouteConfigType } from './types.ts';

export const dispatchControllerValidators = async (config: {
  dataScope: ValidatorScopeType;
  data: Record<string, unknown>;
  routeConfig: ControllerRouteConfigType;
}): Promise<void> => {
  const validators = (config.routeConfig.validators ?? []).filter(
    (v) => v.scope === config.dataScope,
  );

  for (const validator of validators) {
    const result = await validator.value.validate(config.data);
    if (!result.success) {
      throw new ValidationFailedException(
        `${validator.value.constructor.name}: Validation failed`,
        result,
      );
    }
  }
};
