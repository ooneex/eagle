import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertUndefined implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'undefined',
      message: 'Value must be undefined',
    };
  }
}
