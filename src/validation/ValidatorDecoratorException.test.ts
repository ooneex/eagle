import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { ValidatorDecoratorException } from './mod.ts';

describe('ValidatorDecoratorException', () => {
  it('should create exception with default values', () => {
    const message = 'Validation failed';
    const exception = new ValidatorDecoratorException(message);

    expect(exception).toBeInstanceOf(ValidatorDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Validation failed';
    const data = { field: 'username', error: 'Required' };
    const exception = new ValidatorDecoratorException(message, data);

    expect(exception).toBeInstanceOf(ValidatorDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
