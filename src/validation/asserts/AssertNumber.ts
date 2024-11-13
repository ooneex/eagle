import { IAssert } from '@/validation/types.ts';

export class AssertNumber implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: typeof value === 'number',
      message: `${this.property} must be a number`,
    };
  }
}
