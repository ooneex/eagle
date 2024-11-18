import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertNumber implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'number',
      message: 'Value must be a number',
    };
  }
}
