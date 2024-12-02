import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { ValidationFailedException } from './mod.ts';

describe('ValidationFailedException', () => {
  it('should create exception with default values', () => {
    const message = 'Validation failed';
    const exception = new ValidationFailedException(message);

    expect(exception).toBeInstanceOf(ValidationFailedException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.BadRequest);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Validation failed';
    const data = { field: 'username', error: 'Required' };
    const exception = new ValidationFailedException(message, data);

    expect(exception).toBeInstanceOf(ValidationFailedException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.BadRequest);
    expect(exception.data).toEqual(data);
  });
});
