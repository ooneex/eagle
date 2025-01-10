import { beforeEach, describe, expect, it } from 'bun:test';
import { AbstractValidator, V } from '@/validation';

class TestValidator extends AbstractValidator {
  @V.IsString()
  public name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

describe('AbstractValidator', () => {
  let validator: TestValidator;

  beforeEach(() => {
    validator = new TestValidator('test');
  });

  describe('validate', () => {
    it('should return success true when validation passes', async () => {
      const result = await validator.validate();

      expect(result.success).toBe(true);
      expect(result.details).toHaveLength(0);
    });

    it('should return success false when validation fails', async () => {
      validator.name = 123 as any;
      const result = await validator.validate();

      expect(result.success).toBe(false);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].property).toBe('name');
    });

    it('should accept validator options', async () => {
      const options: V.ValidatorOptions = {
        skipMissingProperties: true,
      };
      const result = await validator.validate(options);

      expect(result.success).toBe(true);
    });
  });
});
