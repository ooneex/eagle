import { IAssert } from '@/validation/types.ts';

export class AssertDate implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    const isDate = value instanceof Date && !isNaN(value.getTime());

    return {
      success: isDate,
      message: `${this.property} must be a Date`,
    };
  }
}
