import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertFloatArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    for (const item of value) {
      const isFloat = typeof item === 'number' && !Number.isNaN(item) &&
        Number.isFinite(item) && item % 1 !== 0;

      if (!isFloat) {
        return {
          success: false,
          message: 'Value must contain only float values',
        };
      }
    }

    return {
      success: true,
      message: '',
    };
  }
}
