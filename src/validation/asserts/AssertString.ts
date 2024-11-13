import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertString implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'string',
      message: 'Value must be a string',
    };
  }
}
