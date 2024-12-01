import { Exception } from '@/exception/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { StorageDecoratorException } from './mod.ts';

describe('StorageDecoratorException', () => {
  it('should create exception with default values', () => {
    const message = 'Test error message';
    const exception = new StorageDecoratorException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Test error message';
    const data = { key: 'value' };
    const exception = new StorageDecoratorException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should inherit from Exception class', () => {
    const exception = new StorageDecoratorException('Test');
    expect(exception).toBeInstanceOf(Exception);
  });
});
