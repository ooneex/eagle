import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertDateArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array of Dates',
      };
    }

    const isDateArray = value.every((item) =>
      item instanceof Date && !Number.isNaN(item.getTime())
    );

    return {
      success: isDateArray,
      message: 'Value must be an array of Dates',
    };
  }
}
