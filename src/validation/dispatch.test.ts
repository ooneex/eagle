import { beforeEach, describe, expect, it, spyOn } from 'bun:test';
import { container } from '@/container/container.ts';
import {
  type IValidator,
  ValidatorContainer,
  dispatch,
  validator,
} from '@/validation';

beforeEach(() => {
  ValidatorContainer.clear();
  ValidatorContainer.add('payload', []);
  ValidatorContainer.add('params', []);
  ValidatorContainer.add('queries', []);
  ValidatorContainer.add('cookies', []);
  ValidatorContainer.add('files', []);
  ValidatorContainer.add('form', []);
  ValidatorContainer.add('env', []);
});

describe('dispatch', () => {
  it('should call validate on all validators for given scope', async () => {
    @validator('payload', { skipMissingProperties: true })
    class Test1Validator implements IValidator {
      async validate() {
        return { success: true, details: [] };
      }
    }

    @validator('payload', { forbidUnknownValues: true })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class Test2Validator implements IValidator {
      async validate() {
        return { success: true, details: [] };
      }
    }

    const mockValidator = new Test1Validator();
    const validateSpy = spyOn(mockValidator, 'validate');

    // Mock container get
    const containerGetSpy = spyOn(container, 'get');
    containerGetSpy.mockReturnValue(mockValidator);

    await dispatch('payload');

    expect(ValidatorContainer.get('payload')?.length).toBe(2);
    expect(containerGetSpy).toHaveBeenCalledTimes(2);
    expect(validateSpy).toHaveBeenCalledTimes(2);
    expect(validateSpy).toHaveBeenNthCalledWith(1, {
      skipMissingProperties: true,
    });
    expect(validateSpy).toHaveBeenNthCalledWith(2, {
      forbidUnknownValues: true,
    });
  });

  it('should skip validator if container returns null', async () => {
    @validator('payload')
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class NonExistentValidator implements IValidator {
      async validate() {
        return { success: true, details: [] };
      }
    }

    // Mock container get to return null
    const containerGetSpy = spyOn(container, 'get');
    containerGetSpy.mockReturnValue(null);

    await dispatch('payload');

    expect(ValidatorContainer.get('payload')?.length).toBe(1);
    // expect(containerGetSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle empty validator array', async () => {
    // Clear any existing validators
    ValidatorContainer.clear();

    await dispatch('payload');

    expect(ValidatorContainer.get('payload') ?? []).toEqual([]);
  });

  it('should handle null validator array', async () => {
    // Clear any existing validators
    ValidatorContainer.clear();

    await dispatch('payload');

    expect(ValidatorContainer.get('payload')).toBeUndefined();
  });
});
