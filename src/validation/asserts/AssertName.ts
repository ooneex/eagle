import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';
import { AssertString } from './AssertString.ts';

@assert()
export class AssertName implements IAssert {
  public validate(value: unknown) {
    const isString = new AssertString().validate(value);
    if (!isString.success) return isString;

    return {
      success: /^[a-z][a-z0-9 ]+$/i.test(value as string),
      message: 'Value must be a valid name',
    };
  }
}
