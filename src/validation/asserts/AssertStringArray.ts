import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertStringArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const areAllStrings = value.every((item) => typeof item === 'string');

    return {
      success: areAllStrings,
      message: areAllStrings ? '' : 'All array items must be strings',
    };
  }
}
