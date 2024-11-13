import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertInt implements IAssert {
  public validate(value: unknown) {
    const isInt = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 === 0;

    return {
      success: isInt,
      message: 'Value must be an integer',
    };
  }
}
