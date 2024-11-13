import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertNumber implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'number',
      message: 'Value must be a number',
    };
  }
}
