import { IAssert } from '@/validation/types.ts';

export class AssertArray implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: Array.isArray(value),
      message: `${this.property} must be an array`,
    };
  }
}
