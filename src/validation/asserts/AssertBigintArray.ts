import { IAssert } from '@/validation/types.ts';
import { assert } from '@/validation/decorators.ts';

@assert()
export class AssertBigintArray implements IAssert {
  public validate(value: unknown) {
    const isBigintArray = Array.isArray(value) &&
      value.every((item) => typeof item === 'bigint');

    return {
      success: isBigintArray,
      message: 'Value must be an array of bigints',
    };
  }
}
