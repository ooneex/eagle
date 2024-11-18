import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertString implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'string',
      message: 'Value must be a string',
    };
  }
}
