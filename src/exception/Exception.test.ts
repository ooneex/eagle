import { Exception } from '@/exception/Exception.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Exception Class', () => {
  it('should create Exception with string message', () => {
    const errorMessage = 'Test error message';
    const exception = new Exception(errorMessage);

    expect(exception).toBeInstanceOf(Exception);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBeNull();
    expect(exception.data).toBeNull();
    expect(exception.stacks.length).toBeGreaterThan(0);
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create Exception with Error object', () => {
    const errorMessage = 'Test error message';
    const error = new Error(errorMessage);
    const exception = new Exception(error);

    expect(exception).toBeInstanceOf(Exception);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBeNull();
    expect(exception.data).toBeNull();
  });

  it('should create Exception with status code', () => {
    const errorMessage = 'Test error message';
    const status = 404;
    const exception = new Exception(errorMessage, status);

    expect(exception.status).toBe(status);
  });

  it('should create Exception with additional data', () => {
    const errorMessage = 'Test error message';
    const data = { key: 'value' };
    const exception = new Exception(errorMessage, null, data);

    expect(exception.data).toEqual(data);
  });

  it('should parse stack trace correctly', () => {
    const errorMessage = 'Test error message';
    const exception = new Exception(errorMessage);

    expect(exception.file).not.toBeNull();
    expect(typeof exception.line).toBe('number');
    expect(typeof exception.column).toBe('number');
  });

  it('should throw Exception', () => {
    const errorMessage = 'Test error message';

    const throwableFunction = () => {
      throw new Exception(errorMessage);
    };

    expect(throwableFunction).toThrow(Exception);
    expect(throwableFunction).toThrow(errorMessage);
  });
});