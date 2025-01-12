import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  type IValidator,
  type ValidationResultType,
  ValidatorContainer,
  ValidatorDecoratorException,
  validator,
} from '@/validation';

describe('Validator Decorator', () => {
  it('should register a valid validator class in the container', () => {
    @validator('payload')
    class TestValidator implements IValidator {
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

    const instance = container.get<TestValidator>(TestValidator);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestValidator);
  });

  it('should throw an error if the class is not a validator', () => {
    expect(() => {
      @validator('payload')
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class TestValidator {}
    }).toThrow(ValidatorDecoratorException);
  });

  it('should register validator class with the correct payload data scope', () => {
    ValidatorContainer.add('payload', []);

    @validator('payload')
    class PayloadValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const payloadInstance = container.get<PayloadValidator>(PayloadValidator);

    expect(payloadInstance).toBeDefined();
    expect(payloadInstance).toBeInstanceOf(PayloadValidator);

    const payloadValidators = ValidatorContainer.get('payload');
    expect(payloadValidators).toBeDefined();
    expect(payloadValidators).toHaveLength(1);
    expect(payloadValidators?.[0].value).toBe(PayloadValidator);
  });

  it('should register validator class with the correct params data scope', () => {
    ValidatorContainer.add('params', []);

    @validator('params')
    class ParamsValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const paramsInstance = container.get<ParamsValidator>(ParamsValidator);
    expect(paramsInstance).toBeDefined();
    expect(paramsInstance).toBeInstanceOf(ParamsValidator);

    const paramsValidators = ValidatorContainer.get('params');
    expect(paramsValidators).toBeDefined();
    expect(paramsValidators).toHaveLength(1);
    expect(paramsValidators?.[0].value).toBe(ParamsValidator);
  });

  it('should register validator class with the correct queries data scope', () => {
    ValidatorContainer.add('queries', []);

    @validator('queries')
    class QueriesValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const queriesInstance = container.get<QueriesValidator>(QueriesValidator);
    expect(queriesInstance).toBeDefined();
    expect(queriesInstance).toBeInstanceOf(QueriesValidator);

    const queriesValidators = ValidatorContainer.get('queries');
    expect(queriesValidators).toBeDefined();
    expect(queriesValidators).toHaveLength(1);
    expect(queriesValidators?.[0].value).toBe(QueriesValidator);
  });

  it('should register validator class with the correct cookies data scope', () => {
    ValidatorContainer.add('cookies', []);

    @validator('cookies')
    class CookiesValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const cookiesInstance = container.get<CookiesValidator>(CookiesValidator);
    expect(cookiesInstance).toBeDefined();
    expect(cookiesInstance).toBeInstanceOf(CookiesValidator);

    const cookiesValidators = ValidatorContainer.get('cookies');
    expect(cookiesValidators).toBeDefined();
    expect(cookiesValidators).toHaveLength(1);
    expect(cookiesValidators?.[0].value).toBe(CookiesValidator);
  });

  it('should register validator class with the correct files data scope', () => {
    ValidatorContainer.add('files', []);

    @validator('files')
    class FilesValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const filesInstance = container.get<FilesValidator>(FilesValidator);
    expect(filesInstance).toBeDefined();
    expect(filesInstance).toBeInstanceOf(FilesValidator);

    const filesValidators = ValidatorContainer.get('files');
    expect(filesValidators).toBeDefined();
    expect(filesValidators).toHaveLength(1);
    expect(filesValidators?.[0].value).toBe(FilesValidator);
  });

  it('should register validator class with the correct form data scope', () => {
    ValidatorContainer.add('form', []);

    @validator('form')
    class FormValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const formInstance = container.get<FormValidator>(FormValidator);
    expect(formInstance).toBeDefined();
    expect(formInstance).toBeInstanceOf(FormValidator);

    const formValidators = ValidatorContainer.get('form');
    expect(formValidators).toBeDefined();
    expect(formValidators).toHaveLength(1);
    expect(formValidators?.[0].value).toBe(FormValidator);
  });

  it('should register validator class with the correct env data scope', () => {
    ValidatorContainer.add('env', []);

    @validator('env')
    class EnvValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({ success: true, details: [], logs: [] });
      }

      public validateSync(): ValidationResultType {
        return { success: true, details: [], logs: [] };
      }
    }

    const envInstance = container.get<EnvValidator>(EnvValidator);
    expect(envInstance).toBeDefined();
    expect(envInstance).toBeInstanceOf(EnvValidator);

    const envValidators = ValidatorContainer.get('env');
    expect(envValidators).toBeDefined();
    expect(envValidators).toHaveLength(1);
    expect(envValidators?.[0].value).toBe(EnvValidator);
  });
});
