import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertNullArray implements IAssert {
  public validate(value: unknown) {
    return {
      success: Array.isArray(value) && value.every((item) => item === null),
      message: 'Value must be an array containing only null values',
    };
  }
}
