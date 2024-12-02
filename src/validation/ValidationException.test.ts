import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { ValidationException } from './mod.ts';

describe('ValidationException', () => {
  it('should create exception with default values', () => {
    const message = 'Validation failed';
    const exception = new ValidationException(message);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Validation failed';
    const data = { field: 'username', error: 'Required' };
    const exception = new ValidationException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
