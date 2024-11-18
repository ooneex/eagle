import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertNull implements IAssert {
  public validate(value: unknown) {
    return {
      success: value === null,
      message: 'Value must be null',
    };
  }
}
