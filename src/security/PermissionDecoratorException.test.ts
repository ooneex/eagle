import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { PermissionDecoratorException } from './mod.ts';

describe('PermissionDecoratorException', () => {
  it('should create exception with message only', () => {
    const message = 'Permission denied';
    const exception = new PermissionDecoratorException(message);

    expect(exception).toBeInstanceOf(PermissionDecoratorException);
    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toBeNull();
  });

  it('should create exception with message and data', () => {
    const message = 'Invalid permission configuration';
    const data = { role: 'admin', permission: 'write' };
    const exception = new PermissionDecoratorException(message, data);

    expect(exception.message).toBe(message);
    expect(exception.status).toBe(STATUS_CODE.InternalServerError);
    expect(exception.data).toEqual(data);
  });

  it('should be throwable', () => {
    const message = 'Permission error';

    expect(() => {
      throw new PermissionDecoratorException(message);
    }).toThrow(PermissionDecoratorException);

    expect(() => {
      throw new PermissionDecoratorException(message);
    }).toThrow(message);
  });
});
