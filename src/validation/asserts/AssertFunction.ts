import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertFunction implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'function',
      message: 'Value must be an array',
    };
  }
}
