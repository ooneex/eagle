import { beforeEach, describe, expect, it } from 'bun:test';
import { AbstractValidator } from '@/validation';
import { IsString } from 'class-validator';

interface ValidatorOptions {
  skipMissingProperties?: boolean;
}

class TestValidator extends AbstractValidator {
  @IsString()
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
      const result = await validator.validate({
        name: 'test',
      });

      expect(result.success).toBe(true);
      expect(result.details).toHaveLength(0);
    });

    it('should return success false when validation fails', async () => {
      const result = await validator.validate({
        name: 123,
      });

      expect(result.success).toBe(false);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].property).toBe('name');
    });

    it('should accept validator options', async () => {
      const options: ValidatorOptions = {
        skipMissingProperties: true,
      };
      const result = await validator.validate({}, options);

      expect(result.success).toBe(true);
    });
  });

  describe('validateSync', () => {
    it('should return success true when validation passes', () => {
      const result = validator.validateSync({
        name: 'test',
      });

      expect(result.success).toBe(true);
      expect(result.details).toHaveLength(0);
    });

    it('should return success false when validation fails', () => {
      const result = validator.validateSync({
        name: 123,
      });

      expect(result.success).toBe(false);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].property).toBe('name');
    });

    it('should accept validator options', () => {
      const options: ValidatorOptions = {
        skipMissingProperties: true,
      };
      const result = validator.validateSync({}, options);

      expect(result.success).toBe(true);
    });
  });
});
