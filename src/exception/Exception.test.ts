import { describe, expect, it } from 'bun:test';
import { Exception } from '@/exception';

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

  it('should parse stack trace from Error object', () => {
    const error = new Error('Test error');
    const exception = new Exception(error);

    expect(exception.stacks.length).toBeGreaterThan(0);
    expect(exception.stacks[0]).toHaveProperty('file');
    expect(exception.stacks[0]).toHaveProperty('line');
    expect(exception.stacks[0]).toHaveProperty('column');
  });

  it('should handle empty stack trace', () => {
    const error = new Error('Test error');
    // @ts-ignore: Testing edge case
    error.stack = '';
    const exception = new Exception(error);

    expect(exception.stacks).toEqual([]);
    expect(exception.file).toBeNull();
    expect(exception.line).toBeNull();
    expect(exception.column).toBeNull();
  });

  it('should handle malformed stack trace', () => {
    const error = new Error('Test error');
    // @ts-ignore: Testing edge case
    error.stack = 'Error: Test error\nat malformed_stack';
    const exception = new Exception(error);

    expect(exception.stacks).toEqual([]);
  });

  it('should use correct stack index for direct Exception vs wrapped Error', () => {
    const directException = new Exception('Direct error');
    const wrappedError = new Exception(new Error('Wrapped error'));

    expect(directException.stacks.length).toBeGreaterThan(0);
    expect(wrappedError.stacks.length).toBeGreaterThan(0);

    // Direct exception should use index 2 if available
    const directStack =
      directException.stacks[2 < directException.stacks.length ? 2 : 0];
    expect(directException.file).toBe(directStack.file);

    // Wrapped error should use index 0
    expect(wrappedError.file).toBe(wrappedError.stacks[0].file);
  });
});
