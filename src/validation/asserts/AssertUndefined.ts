import { IAssert } from '@/validation/types.ts';

export class AssertUndefined implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: typeof value === 'undefined',
      message: `${this.property} must be undefined`,
    };
  }
}
