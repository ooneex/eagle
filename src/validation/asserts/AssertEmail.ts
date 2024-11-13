import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertEmail implements IAssert {
  public validate(value: unknown) {
    if (typeof value !== 'string') {
      return {
        success: false,
        message: 'Value must be a string',
      };
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
      success: emailPattern.test(value),
      message: 'Value must be a valid email address',
    };
  }
}
