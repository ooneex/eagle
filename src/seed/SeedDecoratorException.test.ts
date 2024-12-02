import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';
import { SeedDecoratorException } from './mod.ts';

describe('SeedDecoratorException', () => {
  it('should create exception with default values', () => {
    const message = 'Test error message';
    const exception = new SeedDecoratorException(message);

    expect(exception).toBeInstanceOf(SeedDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with custom data', () => {
    const message = 'Test error message';
    const data = { foo: 'bar' };
    const exception = new SeedDecoratorException(message, data);

    expect(exception).toBeInstanceOf(SeedDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
