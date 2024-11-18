import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertUndefined implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'undefined',
      message: 'Value must be undefined',
    };
  }
}
