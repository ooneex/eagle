import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { ContainerException } from './ContainerException.ts';

describe('ContainerException', () => {
  it('should create an exception with default values', () => {
    const message = 'Container error occurred';
    const exception = new ContainerException(message);

    expect(exception).toBeInstanceOf(ContainerException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create an exception with custom data', () => {
    const message = 'Container error occurred';
    const data = { key: 'value' };
    const exception = new ContainerException(message, data);

    expect(exception).toBeInstanceOf(ContainerException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });
});
