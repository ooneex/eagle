import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertDate implements IAssert {
  public validate(value: unknown) {
    const isDate = value instanceof Date && !Number.isNaN(value.getTime());

    return {
      success: isDate,
      message: 'Value must be a Date',
    };
  }
}
