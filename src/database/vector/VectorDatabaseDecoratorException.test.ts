import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { VectorDatabaseDecoratorException } from '../mod.ts';

describe('VectorDatabaseDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Vector database decorator error';
    const exception = new VectorDatabaseDecoratorException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Vector database decorator error';
    const data = {
      decorator: '@VectorDatabase',
      error: 'Invalid configuration',
    };
    const exception = new VectorDatabaseDecoratorException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should extend Exception class', () => {
    const exception = new VectorDatabaseDecoratorException('Test error');
    expect(exception).toBeInstanceOf(Error);
  });
});
