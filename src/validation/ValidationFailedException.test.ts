import { describe, expect, it } from 'bun:test';
import { ValidationFailedException } from '.';
import { STATUS_CODE } from '../http/status';

describe('ValidationFailedException', () => {
  it('should create an exception with default values', () => {
    const message = 'Test error message';
    const exception = new ValidationFailedException(message);

    expect(exception).toBeInstanceOf(ValidationFailedException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.BadRequest);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new ValidationFailedException(message, data);

    expect(exception).toBeInstanceOf(ValidationFailedException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.BadRequest);
    expect(exception.data).toEqual(data);
  });
});
