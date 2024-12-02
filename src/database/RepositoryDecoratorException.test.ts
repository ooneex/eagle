import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { RepositoryDecoratorException } from './mod.ts';

describe('RepositoryDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new RepositoryDecoratorException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { key: 'value' };
    const exception = new RepositoryDecoratorException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should inherit from Exception class', () => {
    const exception = new RepositoryDecoratorException('Test');
    expect(exception).toBeInstanceOf(Error);
  });
});
