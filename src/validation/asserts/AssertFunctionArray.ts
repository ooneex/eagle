import { assert } from '../decorators.ts';
import { IAssert } from '../types.ts';

@assert()
export class AssertFunctionArray implements IAssert {
  public validate(value: unknown) {
    if (!Array.isArray(value)) {
      return {
        success: false,
        message: 'Value must be an array',
      };
    }

    const allFunctions = value.every((item) => typeof item === 'function');

    return {
      success: allFunctions,
      message: allFunctions ? '' : 'All array elements must be functions',
    };
  }
}
