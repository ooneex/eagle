import { describe, expect, it } from 'bun:test';
import { STATUS_CODE } from '../http/status';
import { DatabaseDecoratorException } from './DatabaseDecoratorException';

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
