import { IAssert } from '@/validation/types.ts';

export class AssertFloat implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    const isFloat = typeof value === 'number' && !Number.isNaN(value) &&
      Number.isFinite(value) && value % 1 !== 0;

    return {
      success: isFloat,
      message: `${this.property} must be a float`,
    };
  }
}
