import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertNumberArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const isArrayOfNumbers = value.every((item) => typeof item === 'number');

    return {
      success: isArrayOfNumbers,
      message: 'Value must be an array of numbers',
    };
  }
}
