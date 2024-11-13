import { IAssert } from '@/validation/types.ts';

export class AssertBigint implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    return {
      success: typeof value === 'bigint',
      message: `${this.property} must be a bigint`,
    };
  }
}
