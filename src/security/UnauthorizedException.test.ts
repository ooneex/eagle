import { UnauthorizedException } from '@/security/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { STATUS_CODE } from 'jsr:@std/http@1.0.10/status';

describe('UnauthorizedException', () => {
  it('should create UnauthorizedException with string message', () => {
    const errorMessage = 'Unauthorized access';
    const exception = new UnauthorizedException(errorMessage);

    expect(exception).toBeInstanceOf(UnauthorizedException);
    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.Unauthorized);
    expect(exception.data).toBeNull();
    expect(exception.stacks.length).toBeGreaterThan(0);
    expect(exception.date).toBeInstanceOf(Date);
  });

  it('should create UnauthorizedException with additional data', () => {
    const errorMessage = 'Unauthorized access';
    const data = { userId: '123', attempt: 3 };
    const exception = new UnauthorizedException(errorMessage, data);

    expect(exception.message).toBe(errorMessage);
    expect(exception.status).toBe(STATUS_CODE.Unauthorized);
    expect(exception.data).toEqual(data);
  });

  it('should throw UnauthorizedException', () => {
    const errorMessage = 'Unauthorized access';

    const throwableFunction = () => {
      throw new UnauthorizedException(errorMessage);
    };

    expect(throwableFunction).toThrow(UnauthorizedException);
    expect(throwableFunction).toThrow(errorMessage);
  });

  it('should inherit from Exception class', () => {
    const exception = new UnauthorizedException('Test');
    expect(exception.file).not.toBeNull();
    expect(typeof exception.line).toBe('number');
    expect(typeof exception.column).toBe('number');
  });
});
