import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { DatabaseDecoratorException } from './mod.ts';

describe('DatabaseDecoratorException', () => {
  it('should create an exception with default values', () => {
    const message = 'Database error message';
    const exception = new DatabaseDecoratorException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Database error message';
    const data = { query: 'SELECT * FROM table', error: 'Connection refused' };
    const exception = new DatabaseDecoratorException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should extend Exception class', () => {
    const exception = new DatabaseDecoratorException('Database error');
    expect(exception).toBeInstanceOf(Error);
  });
});
