import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertNotNullArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const hasNull = value.some((item) => item === null);
    return {
      success: !hasNull,
      message: 'Array must not contain null values',
    };
  }
}
