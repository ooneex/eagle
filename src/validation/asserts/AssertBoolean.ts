import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertBoolean implements IAssert {
  public validate(value: unknown) {
    return {
      success: typeof value === 'boolean',
      message: 'Value must be a boolean',
    };
  }
}
