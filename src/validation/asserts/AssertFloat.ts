import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertFloat implements IAssert {
  public validate(value: unknown) {
    const isFloat = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 !== 0;

    return {
      success: isFloat,
      message: 'Value must be a float',
    };
  }
}
