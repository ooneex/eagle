import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertBooleanArray implements IAssert {
  public validate(value: unknown) {
    const isBooleanArray = Array.isArray(value) &&
      value.every((item) => typeof item === 'boolean');

    return {
      success: isBooleanArray,
      message: 'Value must be an array of booleans',
    };
  }
}
