import { describe, expect, it } from 'bun:test';
import {
  AbstractValidator,
  type IValidator,
  IsString,
  ValidationFailedException,
  type ValidationResultType,
  ValidatorContainer,
  dispatchValidators,
  validator,
} from '.';
import { container } from '../container';

describe('Validator Dispatch', () => {
  it('should execute validators in correct order', async () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    class FirstValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
          logs: [],
        });
      }

      public validateSync(): ValidationResultType {
        return {
          success: true,
          details: [],
          logs: [],
        };
      }
    }

    @validator('payload')
    class SecondValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
          logs: [],
        });
      }

      public validateSync(): ValidationResultType {
        return {
          success: true,
          details: [],
          logs: [],
        };
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
              value: 'test',
              constraints: [
                { name: 'isRequired', message: 'test is required' },
              ],
            },
          ],
          logs: [],
        });
      }

      public validateSync(): ValidationResultType {
        return {
          success: false,
          details: [
            {
              property: 'test',
              value: 'test',
              constraints: [
                { name: 'isRequired', message: 'test is required' },
              ],
            },
          ],
          logs: [],
        };
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
          logs: [],
        });
      }

      public validateSync(): ValidationResultType {
        return {
          success: true,
          details: [],
          logs: [],
        };
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

      public validateSync(): ValidationResultType {
        return {
          success: false,
          details: [],
          logs: [],
        };
      }
    }

    expect(dispatchValidators('payload', {})).rejects.toThrow(
      ValidationFailedException,
    );
    expect(dispatchValidators('payload', {})).rejects.toThrow(
      'FailingValidator: Validation failed',
    );
  });

  it('should not throw ValidationFailedException on successful validation', async () => {
    expect(
      dispatchValidators('payload', { name: 'Eagle' }),
    ).resolves.not.toThrow(ValidationFailedException);
  });
});
