import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertArray implements IAssert {
  public validate(value: unknown) {
    return {
      success: Array.isArray(value),
      message: 'Value must be an array',
    };
  }
}
