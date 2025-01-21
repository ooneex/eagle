import { describe, expect, it } from 'bun:test';
import { BadRequestException } from './BadRequestException';

describe('BadRequestException Class', () => {
  it('should create BadRequestException with string message', () => {
    const errorMessage = 'Resource not found';
    const exception = new BadRequestException(errorMessage);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(400);
    expect(exception.data).toBeNull();
    expect(exception.stacks).toBeInstanceOf(Array);
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create BadRequestException with Error object', () => {
    const errorMessage = 'Resource not found';
    const exception = new BadRequestException(errorMessage);

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(400);
    expect(exception.data).toBeNull();
  });

  it('should create BadRequestException with additional data', () => {
    const errorMessage = 'Resource not found';
    const data = { resourceId: '123' };
    const exception = new BadRequestException(errorMessage, data);

    expect(exception.data).toEqual(data);
  });

  it('should parse stack trace correctly', () => {
    const errorMessage = 'Resource not found';
    const exception = new BadRequestException(errorMessage);

    expect(exception.file).not.toBeNull();
    expect(typeof exception.line).toBe('number');
    expect(typeof exception.column).toBe('number');
  });

  it('should throw BadRequestException', () => {
    const errorMessage = 'Resource not found';

    const throwableFunction = () => {
      throw new BadRequestException(errorMessage);
    };

    expect(throwableFunction).toThrow(BadRequestException);
    expect(throwableFunction).toThrow(errorMessage);
  });
});
