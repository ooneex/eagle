import { IAssert } from '@/validation/types.ts';

export class AssertInt implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    const isInt = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 === 0;

    return {
      success: isInt,
      message: `${this.property} must be an integer`,
    };
  }
}
