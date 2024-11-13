import { IAssert } from '@/validation/types.ts';

export class AssertEmail implements IAssert {
  public readonly property: string;

  constructor(property: string) {
    this.property = property;
  }

  public validate(value: unknown) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== 'string') {
      return {
        success: false,
        message: `${this.property} must be a string`,
      };
    }
    return {
      success: emailPattern.test(value),
      message: `${this.property} must be a valid email`,
    };
  }
}
