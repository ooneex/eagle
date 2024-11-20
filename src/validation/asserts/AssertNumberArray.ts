import { parseString } from '../../helper/parseString.ts';
import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertNumberArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const isArrayOfNumbers = value.every((item) => {
      if (typeof item === 'string') {
        item = parseString(item);
      }

      return typeof item === 'number';
    });

    return {
      success: isArrayOfNumbers,
      message: 'Value must be an array of numbers',
    };
  }
}
