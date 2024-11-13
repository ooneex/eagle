import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertNull implements IAssert {
  public validate(value: unknown) {
    return {
      success: value === null,
      message: 'Value must be null',
    };
  }
}
