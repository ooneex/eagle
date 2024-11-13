import { IAssert } from '@/validation/types.ts';

export class AssertString implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: typeof value === 'string',
      message: `${this.property} must be a string`,
    };
  }
}
