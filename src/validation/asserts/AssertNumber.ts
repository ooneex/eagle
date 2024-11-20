import { parseString } from '../../helper/parseString.ts';
import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertNumber implements IAssert {
  public validate(value: unknown) {
    if (typeof value === 'string') {
      value = parseString(value);
    }

    return {
      success: typeof value === 'number',
      message: 'Value must be a number',
    };
  }
}
