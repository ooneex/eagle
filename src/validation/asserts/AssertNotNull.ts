import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertNotNull implements IAssert {
  public validate(value: unknown) {
    return {
      success: value !== null,
      message: 'Value must not be null',
    };
  }
}
