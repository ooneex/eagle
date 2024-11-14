import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertUndefinedArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const allUndefined = value.every((item) => typeof item === 'undefined');

    return {
      success: allUndefined,
      message: 'Array must contain only undefined values',
    };
  }
}
