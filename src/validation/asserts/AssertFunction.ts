import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertFunction implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'function',
      message: 'Value must be an array',
    };
  }
}
