import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertEmailArray implements IAssert {
  public validate(value: unknown) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    for (const email of value) {
      if (typeof email !== 'string') {
        return {
          success: false,
          message: 'Value must contain only strings',
        };
      }
      if (!emailPattern.test(email)) {
        return {
          success: false,
          message: 'Value must contain only valid emails',
        };
      }
    }

    return {
      success: true,
      message: '',
    };
  }
}
