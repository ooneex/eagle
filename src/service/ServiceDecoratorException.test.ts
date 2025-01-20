import { describe, expect, it } from 'bun:test';
import { ServiceDecoratorException } from '.';
import { STATUS_CODE } from '../http/status';

describe('ServiceDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new ServiceDecoratorException(message);

    expect(exception).toBeInstanceOf(ServiceDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new ServiceDecoratorException(message, data);

    expect(exception).toBeInstanceOf(ServiceDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
