import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { MiddlewareDecoratorException } from './mod.ts';

describe('MiddlewareDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new MiddlewareDecoratorException(message);

    expect(exception).toBeInstanceOf(MiddlewareDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new MiddlewareDecoratorException(message, data);

    expect(exception).toBeInstanceOf(MiddlewareDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});