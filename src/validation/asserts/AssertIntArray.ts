import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertIntArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const allIntegers = value.every(
      (item) =>
        typeof item === 'number' &&
        !Number.isNaN(item) &&
        Number.isFinite(item) &&
        item % 1 === 0,
    );

    return {
      success: allIntegers,
      message: 'All array values must be integers',
    };
  }
}
