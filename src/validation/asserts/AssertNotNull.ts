import { IAssert } from '@/validation/types.ts';

export class AssertNotNull implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: value !== null,
      message: `${this.property} must not be null`,
    };
  }
}
