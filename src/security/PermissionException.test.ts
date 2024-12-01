import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http/status';
import { PermissionException } from './mod.ts';

describe('PermissionException', () => {
  it('should create PermissionException with message', () => {
    const errorMessage = 'Access denied';
    const exception = new PermissionException(errorMessage);

    expect(exception).toBeInstanceOf(PermissionException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.Unauthorized);
    expect(exception.data).toBeNull();
  });

  it('should create PermissionException with additional data', () => {
    const errorMessage = 'Insufficient permissions';
    const data = { requiredRole: 'ADMIN', userRole: 'USER' };
    const exception = new PermissionException(errorMessage, data);

    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.Unauthorized);
    expect(exception.data).toEqual(data);
  });

  it('should be throwable', () => {
    const errorMessage = 'Permission denied';

    const throwableFunction = () => {
      throw new PermissionException(errorMessage);
    };

    expect(throwableFunction).toThrow(PermissionException);
    expect(throwableFunction).toThrow(errorMessage);
  });

  it('should inherit from Exception class', () => {
    const exception = new PermissionException('Test error');
    expect(exception.stacks.length).toBeGreaterThan(0);
    expect(exception.date).toBeInstanceOf(Date);
  });
});
