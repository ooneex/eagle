import { describe, expect, it } from 'bun:test';
import { NotFoundException } from '@/exception';

describe('NotFoundException Class', () => {
  it('should create NotFoundException with string message', () => {
    const errorMessage = 'Resource not found';
    const exception = new NotFoundException(errorMessage);

    expect(exception).toBeInstanceOf(NotFoundException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(404);
    expect(exception.data).toBeNull();
    expect(exception.stacks).toBeInstanceOf(Array);
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create NotFoundException with Error object', () => {
    const errorMessage = 'Resource not found';
    const exception = new NotFoundException(errorMessage);

    expect(exception).toBeInstanceOf(NotFoundException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(404);
    expect(exception.data).toBeNull();
  });

  it('should create NotFoundException with additional data', () => {
    const errorMessage = 'Resource not found';
    const data = { resourceId: '123' };
    const exception = new NotFoundException(errorMessage, data);

    expect(exception.data).toEqual(data);
  });

  it('should parse stack trace correctly', () => {
    const errorMessage = 'Resource not found';
    const exception = new NotFoundException(errorMessage);

    expect(exception.file).not.toBeNull();
    expect(typeof exception.line).toBe('number');
    expect(typeof exception.column).toBe('number');
  });

  it('should throw NotFoundException', () => {
    const errorMessage = 'Resource not found';

    const throwableFunction = () => {
      throw new NotFoundException(errorMessage);
    };

    expect(throwableFunction).toThrow(NotFoundException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
