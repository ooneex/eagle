import { IAssert } from '@/validation/types.ts';

export class AssertBoolean implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: typeof value === 'boolean',
      message: `${this.property} must be a boolean`,
    };
  }
}
