import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import type { IValidator, ValidationResultType } from '@/validation';
import {
  AbstractValidator,
  IsString,
  ValidationFailedException,
  ValidatorContainer,
  dispatch,
  validator,
} from '@/validation';

describe('Validator Dispatch', () => {
  it('should execute validators in correct order', async () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    class FirstValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    @validator('payload')
    class SecondValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    expect(ValidatorContainer.get('payload')).toHaveLength(2);
    expect(ValidatorContainer.get('payload')?.[0].value).toBe(FirstValidator);
    expect(ValidatorContainer.get('payload')?.[1].value).toBe(SecondValidator);
  });

  it('should handle failed validation', async () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    class FailingValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: false,
          details: [
            {
              property: 'test',
              constraints: { isRequired: 'test is required' },
            },
          ],
        });
      }
    }

    const instance = container.get<FailingValidator>(FailingValidator);
    const result = await instance.validate();

    expect(result.success).toBe(false);
    expect(result.details).toHaveLength(1);
    expect(result.details[0].property).toBe('test');
  });

  it('should handle successful validation', async () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    class SuccessValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const instance = container.get<SuccessValidator>(SuccessValidator);
    const result = await instance.validate();

    expect(result.success).toBe(true);
    expect(result.details).toHaveLength(0);
  });

  it('should throw ValidationFailedException on failed validation', async () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class FailingValidator extends AbstractValidator implements IValidator {
      @IsString()
      public name: string;
    }

    expect(dispatch('payload', {})).rejects.toThrow(ValidationFailedException);
    expect(dispatch('payload', {})).rejects.toThrow(
      'FailingValidator: Validation failed',
    );
  });

  it('should not throw ValidationFailedException on successful validation', async () => {
    expect(dispatch('payload', { name: 'Eagle' })).resolves.not.toThrow(
      ValidationFailedException,
    );
  });
});
