import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertBoolean implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'boolean',
      message: 'Value must be a boolean',
    };
  }
}
