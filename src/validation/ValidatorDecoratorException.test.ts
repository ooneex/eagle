import { describe, expect, it } from 'bun:test';
import { STATUS_CODE } from '@/http/status.ts';
import { ValidatorDecoratorException } from '@/validation';

describe('ValidatorDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new ValidatorDecoratorException(message);

    expect(exception).toBeInstanceOf(ValidatorDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new ValidatorDecoratorException(message, data);

    expect(exception).toBeInstanceOf(ValidatorDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
