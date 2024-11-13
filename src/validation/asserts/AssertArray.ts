import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertArray implements IAssert {
  public validate(value: unknown) {
    return {
      success: Array.isArray(value),
      message: 'Value must be an array',
    };
  }
}
