import { describe, expect, it } from 'bun:test';
import { StorageDecoratorException } from '.';
import { STATUS_CODE } from '../http/status';

describe('StorageDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new StorageDecoratorException(message);

    expect(exception).toBeInstanceOf(StorageDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new StorageDecoratorException(message, data);

    expect(exception).toBeInstanceOf(StorageDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
